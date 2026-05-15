import { useRef } from 'react';
import { downloadMarkdown, readFileAsText } from '../utils/file';

interface ToolbarProps {
  content: string;
  accent: string;
  onAccentChange: (color: string) => void;
  onImport: (text: string) => void;
  onReset: () => void;
}

const PRESETS = [
  { name: '深蓝', value: '#2563eb' },
  { name: '青墨', value: '#0f766e' },
  { name: '森绿', value: '#047857' },
  { name: '玄紫', value: '#6d28d9' },
  { name: '砖红', value: '#be123c' },
  { name: '炭灰', value: '#475569' },
];

export function Toolbar({ content, accent, onAccentChange, onImport, onReset }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      onImport(text);
    } catch {
      alert('读取文件失败');
    } finally {
      e.target.value = '';
    }
  }

  function handleReset() {
    if (window.confirm('确定要重置为默认模板吗？当前内容会被覆盖。')) {
      onReset();
    }
  }

  return (
    <header className="toolbar">
      <div className="toolbar-brand">ResumeMD</div>
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
        <button onClick={() => fileInputRef.current?.click()}>导入 .md</button>
        <button onClick={() => downloadMarkdown(content)}>下载 .md</button>
        <button onClick={() => window.print()} className="primary">
          导出 PDF
        </button>
        <button onClick={handleReset} className="ghost">
          重置
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,text/markdown"
          onChange={handleFileChange}
          hidden
        />
      </div>
    </header>
  );
}
