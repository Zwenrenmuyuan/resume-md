import { useCallback, useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useDialog } from './components/Dialog';
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
const ANNOUNCEMENT_KEY = 'resumemd:announcement:v1';
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

function hasSeenAnnouncement(): boolean {
  try {
    return localStorage.getItem(ANNOUNCEMENT_KEY) === '1';
  } catch {
    return true;
  }
}

function markAnnouncementSeen() {
  try {
    localStorage.setItem(ANNOUNCEMENT_KEY, '1');
  } catch {
    // 忽略
  }
}

const announcementMarkdown = `ResumeMD 是一个纯前端简历编辑工具。它无需登录，也不会将简历内容上传到服务器；编辑内容默认保存在当前浏览器中。

### 数据保存与备份

- 建议定期使用「下载 .md」或「下载 .json」导出备份。
- 更换设备、清理浏览器数据、使用隐私模式，或浏览器存储异常时，本地内容可能无法恢复。

### PDF 导出

- PDF 导出基于浏览器打印功能，不同浏览器、纸张边距、缩放比例可能带来细微排版差异。
- 导出前建议先检查右侧预览效果。

### 公开页面

- GitHub Pages 页面和 GitHub 仓库只公开工具本身，不包含浏览器中填写的简历内容。
- 项目源码：[github.com/Zwenrenmuyuan/resume-md](https://github.com/Zwenrenmuyuan/resume-md)

之后也可以通过顶部工具栏的「公告」按钮重新查看本提示。
`;

const announcementMarkdownComponents: Components = {
  a: ({ href, title, children }) => (
    <a href={href} title={title} target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
};

const announcementMessage = (
  <div className="announcement-content">
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={announcementMarkdownComponents}>
      {announcementMarkdown}
    </ReactMarkdown>
  </div>
);

export default function App() {
  const { alert } = useDialog();
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

  const showAnnouncement = useCallback(() => {
    void alert({
      title: '使用公告',
      message: announcementMessage,
      confirmText: '我知道了',
      variant: 'announcement',
    });
  }, [alert]);

  useEffect(() => {
    if (hasSeenAnnouncement()) return;
    markAnnouncementSeen();
    showAnnouncement();
  }, [showAnnouncement]);

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
        onAnnouncementOpen={showAnnouncement}
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
