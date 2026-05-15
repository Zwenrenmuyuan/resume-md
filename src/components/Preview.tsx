import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ResumeSchema } from '../types/schema';

type Mode = 'markdown' | 'form';

interface PreviewProps {
  mode: Mode;
  mdContent: string;
  schema: ResumeSchema;
}

// 嵌入式 MD 渲染:把 h1-h4 降级为加粗段落,防止破坏外层简历的标题层级
const inlineMdComponents: Components = {
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
  return (
    <div className="preview-pane">
      {mode === 'markdown' ? (
        <article className="resume">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{mdContent}</ReactMarkdown>
        </article>
      ) : (
        <SchemaPreview schema={schema} />
      )}
    </div>
  );
}

function SchemaPreview({ schema }: { schema: ResumeSchema }) {
  const { profile, sections } = schema;

  const contactParts: React.ReactNode[] = [];
  if (profile.email) contactParts.push(profile.email);
  if (profile.phone) contactParts.push(profile.phone);
  for (const link of profile.links) {
    if (link.url) {
      contactParts.push(
        <a key={link.id} href={link.url}>
          {link.label || link.url}
        </a>
      );
    }
  }
  if (profile.location) contactParts.push(profile.location);

  return (
    <article className="resume">
      {profile.name && <h1>{profile.name}</h1>}
      {contactParts.length > 0 && (
        <p>
          {contactParts.map((part, i) => (
            <React.Fragment key={i}>
              {i > 0 && ' · '}
              {part}
            </React.Fragment>
          ))}
        </p>
      )}
      {profile.summary.trim() && (
        <blockquote>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={inlineMdComponents}>
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
                      remarkPlugins={[remarkGfm]}
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
                remarkPlugins={[remarkGfm]}
                components={inlineMdComponents}
              >
                {section.body}
              </ReactMarkdown>
            )}
          </React.Fragment>
        );
      })}
    </article>
  );
}
