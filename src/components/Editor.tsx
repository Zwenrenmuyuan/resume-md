import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import { markdownAvatarWidget } from './MarkdownAvatarWidget';

interface EditorProps {
  value: string;
  onChange: (next: string) => void;
}

const theme = EditorView.theme({
  '&': { height: '100%', fontSize: '14px' },
  '.cm-scroller': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' },
  '.cm-content': { padding: '12px 0' },
});

export function Editor({ value, onChange }: EditorProps) {
  return (
    <div className="editor-pane">
      <CodeMirror
        value={value}
        onChange={onChange}
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
    </div>
  );
}
