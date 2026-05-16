import { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { FormEditor } from './components/form/FormEditor';
import { useDebouncedLocalStorage } from './hooks/useDebouncedLocalStorage';
import { defaultTemplate } from './templates/default';
import { buildDefaultSchema } from './templates/defaultSchema';
import type { ResumeSchema } from './types/schema';
import {
  DEFAULT_SETTINGS,
  applySettingsToCss,
  type ResumeSettings,
} from './types/settings';

const ACCENT_KEY = 'resumemd:accent';
const MODE_KEY = 'resumemd:mode';
const DEFAULT_ACCENT = '#2563eb';

type Mode = 'markdown' | 'form';

function readAccent(): string {
  try {
    return localStorage.getItem(ACCENT_KEY) || DEFAULT_ACCENT;
  } catch {
    return DEFAULT_ACCENT;
  }
}

function readMode(): Mode {
  try {
    const v = localStorage.getItem(MODE_KEY);
    return v === 'form' ? 'form' : 'markdown';
  } catch {
    return 'markdown';
  }
}

export default function App() {
  const [mdContent, setMdContent] = useDebouncedLocalStorage<string>(
    'resumemd:content',
    defaultTemplate
  );
  const [schema, setSchema] = useDebouncedLocalStorage<ResumeSchema>(
    'resumemd:schema',
    buildDefaultSchema(),
    {
      serialize: (v) => JSON.stringify(v),
      deserialize: (raw) => JSON.parse(raw) as ResumeSchema,
    }
  );
  const [settings, setSettings] = useDebouncedLocalStorage<ResumeSettings>(
    'resumemd:settings',
    DEFAULT_SETTINGS,
    {
      delay: 200,
      serialize: (v) => JSON.stringify(v),
      deserialize: (raw) => ({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) }),
    }
  );

  const [mode, setMode] = useState<Mode>(readMode);
  const [accent, setAccent] = useState<string>(readAccent);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
    try {
      localStorage.setItem(ACCENT_KEY, accent);
    } catch {
      // 忽略
    }
  }, [accent]);

  useEffect(() => {
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch {
      // 忽略
    }
  }, [mode]);

  useEffect(() => {
    applySettingsToCss(settings);
  }, [settings]);

  return (
    <div className="app">
      <Toolbar
        mode={mode}
        onModeChange={setMode}
        accent={accent}
        onAccentChange={setAccent}
        settings={settings}
        onSettingsChange={setSettings}
        mdContent={mdContent}
        onMdImport={setMdContent}
        onMdReset={() => setMdContent(defaultTemplate)}
        schema={schema}
        onSchemaChange={setSchema}
        onSchemaImport={setSchema}
        onSchemaReset={() => setSchema(buildDefaultSchema())}
      />
      <main className="workspace">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={50} minSize={20} className="panel-editor">
            {mode === 'markdown' ? (
              <Editor value={mdContent} onChange={setMdContent} />
            ) : (
              <FormEditor schema={schema} onChange={setSchema} />
            )}
          </Panel>
          <PanelResizeHandle className="resize-handle" />
          <Panel defaultSize={50} minSize={20} className="panel-preview">
            <Preview mode={mode} mdContent={mdContent} schema={schema} />
          </Panel>
        </PanelGroup>
      </main>
    </div>
  );
}
