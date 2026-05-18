import { useRef, useState } from 'react';
import {
  getMarkdownAvatar,
  processAvatarFile,
  removeMarkdownAvatar,
  setMarkdownAvatar,
} from '../utils/avatar';
import { downloadJSON, downloadMarkdown, readFileAsText } from '../utils/file';
import type { ResumeSchema } from '../types/schema';
import type { ResumeSettings } from '../types/settings';
import { useDialog } from './Dialog';
import { SettingsPanel } from './SettingsPanel';

type Mode = 'markdown' | 'form';

interface ToolbarProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  accent: string;
  onAccentChange: (color: string) => void;
  settings: ResumeSettings;
  onSettingsChange: (next: ResumeSettings) => void;
  mdContent: string;
  onMdImport: (text: string) => void;
  onMdReset: () => void;
  schema: ResumeSchema;
  onSchemaChange: (schema: ResumeSchema) => void;
  onSchemaImport: (schema: ResumeSchema) => void;
  onSchemaReset: () => void;
  onAnnouncementOpen: () => void;
}

const PRESETS = [
  { name: '深蓝', value: '#2563eb' },
  { name: '青墨', value: '#0f766e' },
  { name: '橙金', value: '#d97706' },
  { name: '玄紫', value: '#6d28d9' },
  { name: '砖红', value: '#be123c' },
  { name: '炭灰', value: '#475569' },
];

export function Toolbar({
  mode,
  onModeChange,
  accent,
  onAccentChange,
  settings,
  onSettingsChange,
  mdContent,
  onMdImport,
  onMdReset,
  schema,
  onSchemaChange,
  onSchemaImport,
  onSchemaReset,
  onAnnouncementOpen,
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { confirm, alert } = useDialog();
  const isForm = mode === 'form';
  const markdownAvatar = getMarkdownAvatar(mdContent);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      if (isForm) {
        const parsed = JSON.parse(text) as ResumeSchema;
        if (
          !parsed.profile ||
          typeof parsed.profile.avatarSrc !== 'string' ||
          !Array.isArray(parsed.profile.headerItems) ||
          !Array.isArray(parsed.profile.headerRows) ||
          !parsed.profile.headerRows.every(Array.isArray) ||
          !Array.isArray(parsed.sections)
        ) {
          throw new Error('Invalid schema');
        }
        onSchemaImport(parsed);
      } else {
        onMdImport(text);
      }
    } catch {
      await alert({
        title: '导入失败',
        message: isForm ? '文件不是合法的简历 JSON 格式。' : '读取文件失败,请确认是 Markdown 文本。',
      });
    } finally {
      e.target.value = '';
    }
  }

  async function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const avatarSrc = await processAvatarFile(file);
      onMdImport(setMarkdownAvatar(mdContent, avatarSrc));
    } catch (error) {
      await alert({
        title: '头像上传失败',
        message: error instanceof Error ? error.message : '无法处理这张图片。',
      });
    } finally {
      e.target.value = '';
    }
  }

  async function handleReset() {
    const ok = await confirm({
      title: '重置为默认模板',
      message: '当前内容会被默认模板覆盖,此操作无法撤销。',
      confirmText: '重置',
      danger: true,
    });
    if (ok) {
      if (isForm) onSchemaReset();
      else onMdReset();
    }
  }

  function handleDownload() {
    if (isForm) {
      downloadJSON(schema, 'resume.json');
    } else {
      downloadMarkdown(mdContent);
    }
  }

  return (
    <header className="toolbar">
      <div className="toolbar-left">
        <div className="toolbar-brand">ResumeMD</div>
        <div className="mode-tabs" role="tablist" aria-label="编辑模式">
          <button
            role="tab"
            aria-selected={mode === 'markdown'}
            className={`mode-tab${mode === 'markdown' ? ' active' : ''}`}
            onClick={() => onModeChange('markdown')}
          >
            Markdown
          </button>
          <button
            role="tab"
            aria-selected={mode === 'form'}
            className={`mode-tab${mode === 'form' ? ' active' : ''}`}
            onClick={() => onModeChange('form')}
          >
            表单
          </button>
        </div>
      </div>
      <div className="toolbar-actions">
        <div className="theme-picker" title="主题色">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              className={`swatch${accent.toLowerCase() === p.value.toLowerCase() ? ' active' : ''}`}
              style={{ background: p.value }}
              onClick={() => onAccentChange(p.value)}
              title={p.name}
              aria-label={`主题色 ${p.name}`}
            />
          ))}
          <label className="swatch-custom" title="自定义颜色">
            <input
              type="color"
              value={accent}
              onChange={(e) => onAccentChange(e.target.value)}
            />
          </label>
        </div>
        {!isForm && (
          <>
            <button onClick={() => avatarInputRef.current?.click()}>
              {markdownAvatar ? '替换头像' : '上传头像'}
            </button>
            {markdownAvatar && (
              <button onClick={() => onMdImport(removeMarkdownAvatar(mdContent))}>
                移除头像
              </button>
            )}
          </>
        )}
        <button onClick={() => fileInputRef.current?.click()}>
          {isForm ? '导入 .json' : '导入 .md'}
        </button>
        <button onClick={handleDownload}>
          {isForm ? '下载 .json' : '下载 .md'}
        </button>
        <button onClick={() => window.print()} className="primary">
          导出 PDF
        </button>
        <button type="button" onClick={onAnnouncementOpen} className="notice-button">
          公告
        </button>
        <button
          ref={settingsButtonRef}
          onClick={() => setSettingsOpen((v) => !v)}
          className={`icon-btn${settingsOpen ? ' active' : ''}`}
          title="设置"
          aria-label="设置"
          aria-expanded={settingsOpen}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
        <button onClick={handleReset} className="ghost">
          重置
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={isForm ? '.json,application/json' : '.md,.markdown,text/markdown'}
          onChange={handleFileChange}
          hidden
        />
        {!isForm && (
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarFileChange}
            hidden
          />
        )}
        <SettingsPanel
          open={settingsOpen}
          anchorRef={settingsButtonRef}
          settings={settings}
          onChange={onSettingsChange}
          profile={schema.profile}
          onProfileChange={(profile) => onSchemaChange({ ...schema, profile })}
          showHeaderLayout={isForm}
          onClose={() => setSettingsOpen(false)}
        />
      </div>
    </header>
  );
}
