import { useEffect, useRef } from 'react';
import type { HeaderItem, Profile } from '../types/schema';
import {
  DEFAULT_SETTINGS,
  SETTINGS_RANGE,
  type ResumeSettings,
} from '../types/settings';
import {
  buildDefaultHeaderRows,
  canMoveHeaderItem,
  MAX_HEADER_ROWS,
  moveHeaderItem,
  type HeaderMoveDirection,
} from '../utils/headerLayout';

interface SettingsPanelProps {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  settings: ResumeSettings;
  onChange: (next: ResumeSettings) => void;
  profile: Profile;
  onProfileChange: (next: Profile) => void;
  showHeaderLayout: boolean;
  onClose: () => void;
}

const KEYS: (keyof ResumeSettings)[] = [
  'profileFontSize',
  'headingFontSize',
  'bodyFontSize',
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
  profile,
  onProfileChange,
  showHeaderLayout,
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

  function resetTypography() {
    onChange({ ...DEFAULT_SETTINGS });
  }

  return (
    <div ref={panelRef} className="settings-panel" role="dialog" aria-label="设置">
      <div className="settings-panel-header">
        <span className="settings-panel-title">设置</span>
      </div>
      <div className="settings-panel-body">
        <section className="settings-group">
          <div className="settings-group-head">
            <span className="settings-group-title">排版</span>
            <button type="button" className="settings-reset" onClick={resetTypography}>
              重置默认
            </button>
          </div>
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
                  onChange={(e) =>
                    update(key, Number(e.target.value) as ResumeSettings[typeof key])
                  }
                />
              </div>
            );
          })}
        </section>

        {showHeaderLayout && (
          <HeaderLayoutEditor profile={profile} onChange={onProfileChange} />
        )}
      </div>
    </div>
  );
}

function HeaderLayoutEditor({
  profile,
  onChange,
}: {
  profile: Profile;
  onChange: (next: Profile) => void;
}) {
  function updateRows(headerRows: string[][]) {
    onChange({ ...profile, headerRows });
  }

  function moveItem(id: string, direction: HeaderMoveDirection) {
    updateRows(moveHeaderItem(profile.headerRows, id, direction));
  }

  function resetLayout() {
    updateRows(buildDefaultHeaderRows(profile.headerItems));
  }

  const displayRows = Array.from(
    { length: MAX_HEADER_ROWS },
    (_, index) => profile.headerRows[index] ?? []
  );

  return (
    <section className="settings-group">
      <div className="settings-group-head">
        <span className="settings-group-title">头部信息布局</span>
        <button type="button" className="settings-reset" onClick={resetLayout}>
          恢复默认
        </button>
      </div>
      <p className="settings-group-hint">最多三行。用按钮调整每项的顺序和所在行。</p>
      <div className="header-layout">
        {displayRows.map((row, rowIndex) => (
          <div key={rowIndex} className="header-layout-row">
            <span className="header-layout-label">第 {rowIndex + 1} 行</span>
            {row.length === 0 ? (
              <span className="header-layout-empty">空</span>
            ) : (
              <div className="header-layout-items">
                {row.map((id) => (
                  <HeaderLayoutItem
                    key={id}
                    itemId={id}
                    label={getHeaderItemLabel(profile.headerItems, id)}
                    rows={profile.headerRows}
                    onMove={moveItem}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function HeaderLayoutItem({
  itemId,
  label,
  rows,
  onMove,
}: {
  itemId: string;
  label: string;
  rows: string[][];
  onMove: (id: string, direction: HeaderMoveDirection) => void;
}) {
  return (
    <div className="header-layout-item">
      <span className="header-layout-name" title={label}>
        {label}
      </span>
      <div className="header-layout-actions">
        <MoveButton itemId={itemId} label={label} rows={rows} direction="left" onMove={onMove}>
          ←
        </MoveButton>
        <MoveButton itemId={itemId} label={label} rows={rows} direction="right" onMove={onMove}>
          →
        </MoveButton>
        <MoveButton itemId={itemId} label={label} rows={rows} direction="up" onMove={onMove}>
          ↑
        </MoveButton>
        <MoveButton itemId={itemId} label={label} rows={rows} direction="down" onMove={onMove}>
          ↓
        </MoveButton>
      </div>
    </div>
  );
}

function MoveButton({
  itemId,
  label,
  rows,
  direction,
  onMove,
  children,
}: {
  itemId: string;
  label: string;
  rows: string[][];
  direction: HeaderMoveDirection;
  onMove: (id: string, direction: HeaderMoveDirection) => void;
  children: string;
}) {
  const directionLabel = {
    left: '前移',
    right: '后移',
    up: '移到上一行',
    down: '移到下一行',
  }[direction];

  return (
    <button
      type="button"
      className="btn-icon"
      disabled={!canMoveHeaderItem(rows, itemId, direction)}
      onClick={() => onMove(itemId, direction)}
      title={`${directionLabel} ${label}`}
      aria-label={`${directionLabel} ${label}`}
    >
      {children}
    </button>
  );
}

function getHeaderItemLabel(items: HeaderItem[], id: string): string {
  const itemIndex = items.findIndex((item) => item.id === id);
  const item = items[itemIndex];
  if (!item) return '信息项';

  return item.label.trim() || item.value.trim() || `信息项 ${itemIndex + 1}`;
}
