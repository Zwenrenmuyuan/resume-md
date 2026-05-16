import { useRef } from 'react';
import type { HeaderItem, HeaderItemKind, Profile } from '../../types/schema';
import { useDialog } from '../Dialog';
import { processAvatarFile } from '../../utils/avatar';
import {
  appendHeaderItem,
  removeHeaderItem as removeHeaderItemFromRows,
} from '../../utils/headerLayout';
import { newId } from '../../utils/id';
import { Field } from './Field';
import { MarkdownField } from './MarkdownField';

interface ProfileFormProps {
  profile: Profile;
  onChange: (next: Profile) => void;
}

const HEADER_KIND_LABELS: Record<HeaderItemKind, string> = {
  text: '文本',
  link: '链接',
};

export function ProfileForm({ profile, onChange }: ProfileFormProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { alert } = useDialog();

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    onChange({ ...profile, [key]: value });
  }

  function updateHeaderItem(id: string, patch: Partial<HeaderItem>) {
    update(
      'headerItems',
      profile.headerItems.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }

  function addHeaderItem() {
    const id = newId('h_');
    onChange({
      ...profile,
      headerItems: [
        ...profile.headerItems,
        { id, label: '', kind: 'text', value: '', showLabel: false },
      ],
      headerRows: appendHeaderItem(profile.headerRows, id),
    });
  }

  function deleteHeaderItem(id: string) {
    onChange({
      ...profile,
      headerItems: profile.headerItems.filter((item) => item.id !== id),
      headerRows: removeHeaderItemFromRows(profile.headerRows, id),
    });
  }

  async function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      update('avatarSrc', await processAvatarFile(file));
    } catch (error) {
      await alert({
        title: '头像上传失败',
        message: error instanceof Error ? error.message : '无法处理这张图片。',
      });
    } finally {
      e.target.value = '';
    }
  }

  return (
    <section className="form-card">
      <header className="form-card-header">
        <h2>个人信息</h2>
      </header>
      <div className="form-card-body">
        <div className="avatar-editor">
          <span className="form-field-label">头像</span>
          <div className="avatar-editor-body">
            {profile.avatarSrc ? (
              <img className="avatar-thumb" src={profile.avatarSrc} alt="当前头像" />
            ) : (
              <div className="avatar-empty">未上传头像</div>
            )}
            <div className="avatar-actions">
              <button
                type="button"
                className="btn-mini"
                onClick={() => avatarInputRef.current?.click()}
              >
                {profile.avatarSrc ? '替换头像' : '上传头像'}
              </button>
              {profile.avatarSrc && (
                <button
                  type="button"
                  className="btn-mini danger"
                  onClick={() => update('avatarSrc', '')}
                >
                  移除
                </button>
              )}
            </div>
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarFileChange}
            hidden
          />
        </div>

        <div className="form-row">
          <Field label="姓名" span={2}>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="张三"
            />
          </Field>
        </div>

        <div className="form-subsection">
          <div className="form-subsection-header">
            <span className="form-subsection-title">头部信息</span>
            <button type="button" className="btn-mini" onClick={addHeaderItem}>
              + 添加
            </button>
          </div>
          {profile.headerItems.length === 0 ? (
            <p className="form-empty">暂无头部信息</p>
          ) : (
            <div className="header-item-list">
              {profile.headerItems.map((item) => (
                <div key={item.id} className="header-item-card">
                  <div className="header-item-main">
                    <input
                      type="text"
                      className="header-item-label"
                      value={item.label}
                      onChange={(e) => updateHeaderItem(item.id, { label: e.target.value })}
                      placeholder="标签，如 求职意向"
                    />
                    <select
                      className="header-item-kind"
                      value={item.kind}
                      onChange={(e) =>
                        updateHeaderItem(item.id, { kind: e.target.value as HeaderItemKind })
                      }
                    >
                      {Object.entries(HEADER_KIND_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="header-item-value"
                      value={item.value}
                      onChange={(e) => updateHeaderItem(item.id, { value: e.target.value })}
                      placeholder={getValuePlaceholder(item.kind)}
                    />
                    <button
                      type="button"
                      className="btn-icon danger"
                      onClick={() => deleteHeaderItem(item.id)}
                      title="删除"
                    >
                      ✕
                    </button>
                  </div>
                  {item.kind === 'link' && (
                    <input
                      type="url"
                      className="header-item-href"
                      value={item.href ?? ''}
                      onChange={(e) => updateHeaderItem(item.id, { href: e.target.value })}
                      placeholder="https://..."
                    />
                  )}
                  <label className="header-item-option">
                    <input
                      type="checkbox"
                      checked={item.showLabel}
                      onChange={(e) =>
                        updateHeaderItem(item.id, { showLabel: e.target.checked })
                      }
                    />
                    <span>预览中显示标签</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Field label="一句话简介(支持 Markdown)" span={2}>
          <MarkdownField
            value={profile.summary}
            onChange={(v) => update('summary', v)}
            placeholder="一句话总结你自己..."
          />
        </Field>
      </div>
    </section>
  );
}

function getValuePlaceholder(kind: HeaderItemKind) {
  switch (kind) {
    case 'link':
      return 'github.com/you';
    case 'text':
      return '例如 上海 / 前端工程师 / 25 岁 / you@example.com';
  }
}
