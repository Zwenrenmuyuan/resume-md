import { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { useDebouncedLocalStorage } from './hooks/useDebouncedLocalStorage';
import { defaultTemplate } from './templates/default';

const ACCENT_KEY = 'resumemd:accent';
const DEFAULT_ACCENT = '#2563eb';

function readAccent(): string {
  try {
    return localStorage.getItem(ACCENT_KEY) || DEFAULT_ACCENT;
  } catch {
    return DEFAULT_ACCENT;
  }
}

export default function App() {
  const [content, setContent] = useDebouncedLocalStorage(defaultTemplate);
  const [accent, setAccent] = useState<string>(readAccent);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
    try {
      localStorage.setItem(ACCENT_KEY, accent);
    } catch {
      // 忽略
    }
  }, [accent]);

  return (
    <div className="app">
      <Toolbar
        content={content}
        accent={accent}
        onAccentChange={setAccent}
        onImport={setContent}
        onReset={() => setContent(defaultTemplate)}
      />
      <main className="workspace">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={50} minSize={20} className="panel-editor">
            <Editor value={content} onChange={setContent} />
          </Panel>
          <PanelResizeHandle className="resize-handle" />
          <Panel defaultSize={50} minSize={20} className="panel-preview">
            <Preview content={content} />
          </Panel>
        </PanelGroup>
      </main>
    </div>
  );
}
