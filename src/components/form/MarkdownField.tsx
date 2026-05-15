import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';

interface MarkdownFieldProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const fieldTheme = EditorView.theme({
  '&': { fontSize: '13px' },
  '.cm-content': { padding: '8px 4px', fontFamily: 'inherit' },
  '.cm-line': { padding: '0 4px' },
});

export function MarkdownField({ value, onChange, placeholder, minHeight = 70 }: MarkdownFieldProps) {
  return (
    <div className="md-field">
      <CodeMirror
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        extensions={[markdown(), EditorView.lineWrapping, fieldTheme]}
        basicSetup={{
          lineNumbers: false,
          highlightActiveLine: false,
          foldGutter: false,
          autocompletion: false,
          highlightActiveLineGutter: false,
        }}
        minHeight={`${minHeight}px`}
        maxHeight="240px"
      />
    </div>
  );
}
