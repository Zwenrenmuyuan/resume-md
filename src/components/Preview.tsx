import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { HeaderItem, Profile, ResumeSchema } from '../types/schema';
import { splitMarkdownAvatar } from '../utils/avatar';

type Mode = 'markdown' | 'form';

interface MarkdownNode {
  type?: string;
  value?: unknown;
  children?: MarkdownNode[];
  data?: {
    hProperties?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

interface PreviewProps {
  mode: Mode;
  mdContent: string;
  schema: ResumeSchema;
}

const externalLinkComponent: Components['a'] = ({ href, title, children }) => (
  <a href={href} title={title} target="_blank" rel="noreferrer">
    {children}
  </a>
);

const markdownRemarkPlugins = [remarkGfm, remarkColumnLists];

const markdownComponents: Components = {
  a: externalLinkComponent,
  p: ({ children }) => <p>{renderMarkdownSeparators(children)}</p>,
};

// 嵌入式 MD 渲染:把 h1-h4 降级为加粗段落,防止破坏外层简历的标题层级
const inlineMdComponents: Components = {
  a: externalLinkComponent,
  h1: ({ children }) => (
    <p>
      <strong>{children}</strong>
    </p>
  ),
  h2: ({ children }) => (
    <p>
      <strong>{children}</strong>
    </p>
  ),
  h3: ({ children }) => (
    <p>
      <strong>{children}</strong>
    </p>
  ),
  h4: ({ children }) => (
    <p>
      <strong>{children}</strong>
    </p>
  ),
};

export function Preview({ mode, mdContent, schema }: PreviewProps) {
  const markdown = splitMarkdownAvatar(mdContent);

  return (
    <div className="preview-pane">
      {mode === 'markdown' ? (
        <ResumeArticle avatarSrc={markdown.avatarSrc}>
          <ReactMarkdown remarkPlugins={markdownRemarkPlugins} components={markdownComponents}>
            {markdown.body}
          </ReactMarkdown>
        </ResumeArticle>
      ) : (
        <SchemaPreview schema={schema} />
      )}
    </div>
  );
}

function SchemaPreview({ schema }: { schema: ResumeSchema }) {
  const { profile, sections } = schema;
  const headerRows = profile.headerRows
    .map((row) => row.map((id) => renderHeaderItem(profile, id)).filter(isPresent))
    .filter((row) => row.length > 0);

  return (
    <ResumeArticle avatarSrc={profile.avatarSrc} avatarAlt={profile.name}>
      {profile.name && <h1>{profile.name}</h1>}
      {headerRows.length > 0 && (
        <p>
          {headerRows.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {rowIndex > 0 && <br />}
              {renderHeaderLine(row, `row-${rowIndex}`)}
            </React.Fragment>
          ))}
        </p>
      )}
      {profile.summary.trim() && (
        <blockquote>
          <ReactMarkdown remarkPlugins={markdownRemarkPlugins} components={inlineMdComponents}>
            {profile.summary}
          </ReactMarkdown>
        </blockquote>
      )}

      {sections.map((section) => {
        if (section.type === 'timeline') {
          return (
            <React.Fragment key={section.id}>
              {section.title && <h2>{section.title}</h2>}
              {section.items.map((item) => (
                <React.Fragment key={item.id}>
                  <h3>
                    {item.title}
                    {item.subtitle && <> — {item.subtitle}</>}
                    {(item.start || item.end) && (
                      <em>{[item.start, item.end].filter(Boolean).join(' - ')}</em>
                    )}
                  </h3>
                  {item.description && (
                    <ReactMarkdown
                      remarkPlugins={markdownRemarkPlugins}
                      components={inlineMdComponents}
                    >
                      {item.description}
                    </ReactMarkdown>
                  )}
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        }
        return (
          <React.Fragment key={section.id}>
            {section.title && <h2>{section.title}</h2>}
            {section.body && (
              <ReactMarkdown
                remarkPlugins={markdownRemarkPlugins}
                components={inlineMdComponents}
              >
                {section.body}
              </ReactMarkdown>
            )}
          </React.Fragment>
        );
      })}
    </ResumeArticle>
  );
}

function ResumeArticle({
  avatarSrc,
  avatarAlt,
  children,
}: {
  avatarSrc: string;
  avatarAlt?: string;
  children: React.ReactNode;
}) {
  return (
    <article className={`resume${avatarSrc ? ' has-avatar' : ''}`}>
      {avatarSrc && (
        <img
          className="resume-avatar"
          src={avatarSrc}
          alt={avatarAlt ? `${avatarAlt}头像` : '头像'}
        />
      )}
      {children}
    </article>
  );
}

function renderHeaderItem(profile: Profile, id: string): React.ReactNode | null {
  const item = profile.headerItems.find((entry) => entry.id === id);
  if (!item?.value.trim()) return null;

  const content = getHeaderDisplayValue(item);

  if (item.kind === 'link' && item.href?.trim()) {
    return (
      <>
        {item.showLabel && item.label.trim() && `${item.label.trim()}：`}
        <a href={item.href} target="_blank" rel="noreferrer">
          {content}
        </a>
      </>
    );
  }

  return `${item.showLabel && item.label.trim() ? `${item.label.trim()}：` : ''}${content}`;
}

function getHeaderDisplayValue(item: HeaderItem) {
  return item.value.trim();
}

function renderHeaderLine(parts: React.ReactNode[], keyPrefix: string) {
  return parts.map((part, i) => (
    <React.Fragment key={`${keyPrefix}-${i}`}>
      {i > 0 && <span className="resume-header-separator">·</span>}
      {part}
    </React.Fragment>
  ));
}

function renderMarkdownSeparators(children: React.ReactNode) {
  return React.Children.map(children, (child, childIndex) => {
    if (typeof child !== 'string') return child;

    return child.split(' · ').map((part, partIndex) => (
      <React.Fragment key={`${childIndex}-${partIndex}`}>
        {partIndex > 0 && <span className="resume-header-separator">·</span>}
        {part}
      </React.Fragment>
    ));
  });
}

function remarkColumnLists() {
  return (tree: MarkdownNode) => {
    markColumnLists(tree);
  };
}

function markColumnLists(parent: MarkdownNode) {
  const children = parent.children;
  if (!children) return;

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];

    if (child.type === 'html' && isColumnListMarker(child.value)) {
      const next = children[index + 1];
      if (next?.type === 'list') {
        addClassName(next, 'resume-list-columns');
      }
      children.splice(index, 1);
      index -= 1;
      continue;
    }

    markColumnLists(child);
  }
}

function isColumnListMarker(value: unknown) {
  return typeof value === 'string' && /^\s*<!--\s*resume:columns\s*-->\s*$/.test(value);
}

function addClassName(node: MarkdownNode, className: string) {
  const data = node.data ?? (node.data = {});
  const hProperties = data.hProperties ?? (data.hProperties = {});
  const existingClassName = hProperties.className;
  const classNames = Array.isArray(existingClassName)
    ? existingClassName.filter((name): name is string => typeof name === 'string')
    : typeof existingClassName === 'string'
      ? existingClassName.split(/\s+/).filter(Boolean)
      : [];

  if (!classNames.includes(className)) {
    classNames.push(className);
  }

  hProperties.className = classNames.join(' ');
}

function isPresent<T>(value: T | null): value is T {
  return value !== null;
}
