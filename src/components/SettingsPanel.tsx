import { useEffect, useRef } from 'react';
import {
  DEFAULT_SETTINGS,
  SETTINGS_RANGE,
  type ResumeSettings,
} from '../types/settings';

interface SettingsPanelProps {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  settings: ResumeSettings;
  onChange: (next: ResumeSettings) => void;
  onClose: () => void;
}

const KEYS: (keyof ResumeSettings)[] = [
  'sectionGap',
  'paragraphGap',
  'listItemGap',
  'lineHeight',
];

export function SettingsPanel({
  open,
  anchorRef,
  settings,
  onChange,
  onClose,
}: SettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose();
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, anchorRef, onClose]);

  if (!open) return null;

  function update<K extends keyof ResumeSettings>(key: K, value: ResumeSettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  function reset() {
    onChange({ ...DEFAULT_SETTINGS });
  }

  return (
    <div ref={panelRef} className="settings-panel" role="dialog" aria-label="排版设置">
      <div className="settings-panel-header">
        <span className="settings-panel-title">排版设置</span>
        <button type="button" className="settings-reset" onClick={reset}>
          重置默认
        </button>
      </div>
      <div className="settings-panel-body">
        {KEYS.map((key) => {
          const range = SETTINGS_RANGE[key];
          const value = settings[key];
          const display =
            range.step < 1 ? value.toFixed(2).replace(/\.?0+$/, '') : value.toString();
          return (
            <div key={key} className="settings-row">
              <div className="settings-row-head">
                <label htmlFor={`setting-${key}`}>{range.label}</label>
                <span className="settings-value">
                  {display}
                  {range.unit && <small> {range.unit}</small>}
                </span>
              </div>
              <input
                id={`setting-${key}`}
                type="range"
                min={range.min}
                max={range.max}
                step={range.step}
                value={value}
                onChange={(e) => update(key, Number(e.target.value) as ResumeSettings[typeof key])}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
