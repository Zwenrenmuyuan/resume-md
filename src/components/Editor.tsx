import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import { MarkdownGuide } from './MarkdownGuide';
import { markdownAvatarWidget } from './MarkdownAvatarWidget';

interface EditorProps {
  value: string;
  onChange: (next: string) => void;
}

const MARKDOWN_PLACEHOLDER = '# 张三\n\n> 用 Markdown 编写简历,支持 GFM 表格、列表和链接。';

const theme = EditorView.theme({
  '&': { height: '100%', fontSize: '14px', background: '#ffffff' },
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    lineHeight: '1.7',
  },
  '.cm-content': { padding: '18px 0 44px', caretColor: 'var(--accent)' },
  '.cm-line': { padding: '0 18px' },
  '.cm-gutters': {
    background: '#ffffff',
    borderRight: '1px solid #f1f5f9',
    color: '#94a3b8',
  },
  '.cm-activeLine': { backgroundColor: 'color-mix(in srgb, var(--accent) 6%, transparent)' },
  '.cm-activeLineGutter': {
    backgroundColor: 'color-mix(in srgb, var(--accent) 7%, transparent)',
    color: '#475569',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: 'color-mix(in srgb, var(--accent) 22%, transparent)',
  },
});

export function Editor({ value, onChange }: EditorProps) {
  const [activePanel, setActivePanel] = useState<'editor' | 'guide'>('editor');

  return (
    <div className="editor-pane">
      <div className="markdown-editor-header">
        <div>
          <span className="markdown-editor-kicker">Markdown</span>
          <strong>简历源码</strong>
        </div>
        <div className="markdown-editor-tabs" role="tablist" aria-label="Markdown 编辑器面板">
          <button
            type="button"
            role="tab"
            aria-selected={activePanel === 'editor'}
            className={activePanel === 'editor' ? 'active' : ''}
            onClick={() => setActivePanel('editor')}
          >
            编辑
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activePanel === 'guide'}
            className={activePanel === 'guide' ? 'active' : ''}
            onClick={() => setActivePanel('guide')}
          >
            说明
          </button>
        </div>
      </div>
      {activePanel === 'editor' ? (
        <CodeMirror
          className="markdown-codemirror"
          value={value}
          onChange={onChange}
          placeholder={MARKDOWN_PLACEHOLDER}
          extensions={[markdown(), markdownAvatarWidget(), EditorView.lineWrapping, theme]}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            foldGutter: true,
            autocompletion: false,
          }}
          height="100%"
          style={{ height: '100%' }}
        />
      ) : (
        <MarkdownGuide />
      )}
    </div>
  );
}
