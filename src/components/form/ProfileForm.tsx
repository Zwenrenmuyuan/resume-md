import { useRef } from 'react';
import type { HeaderItem, HeaderItemKind, Profile } from '../../types/schema';
import { useDialog } from '../Dialog';
import { processAvatarFile } from '../../utils/avatar';
import {
  appendHeaderItem,
  removeHeaderItem as removeHeaderItemFromRows,
} from '../../utils/headerLayout';
import { newId } from '../../utils/id';
import { EmptyState } from './EmptyState';
import { FormButton } from './FormButton';
import { FormCard, FormCardBody, FormCardHeader } from './FormCard';
import { CheckboxField, FileInput, SelectInput, TextInput } from './FormControls';
import { FormField } from './FormField';
import { MarkdownField } from './MarkdownField';

interface ProfileFormProps {
  profile: Profile;
  onChange: (next: Profile) => void;
}

const HEADER_KIND_LABELS: Record<HeaderItemKind, string> = {
  text: '文本',
  link: '链接',
};

const HEADER_KIND_OPTIONS = Object.entries(HEADER_KIND_LABELS).map(([value, label]) => ({
  value,
  label,
}));

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
    <FormCard variant="profile">
      <FormCardHeader variant="profile">
        <h2>个人信息</h2>
      </FormCardHeader>
      <FormCardBody variant="profile">
        <div className="avatar-editor">
          <span className="form-field-label">头像</span>
          <div className="avatar-editor-body">
            {profile.avatarSrc ? (
              <img className="avatar-thumb" src={profile.avatarSrc} alt="当前头像" />
            ) : (
              <div className="avatar-empty">未上传头像</div>
            )}
            <div className="avatar-actions">
              <FormButton onClick={() => avatarInputRef.current?.click()}>
                {profile.avatarSrc ? '替换头像' : '上传头像'}
              </FormButton>
              {profile.avatarSrc && (
                <FormButton variant="danger" onClick={() => update('avatarSrc', '')}>
                  移除
                </FormButton>
              )}
            </div>
          </div>
          <FileInput
            ref={avatarInputRef}
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarFileChange}
            hidden
          />
        </div>

        <div className="form-row">
          <FormField label="姓名" span={2}>
            <TextInput
              value={profile.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="XXX"
            />
          </FormField>
        </div>

        <div className="form-subsection">
          <div className="form-subsection-header">
            <span className="form-subsection-title">头部信息</span>
            <FormButton onClick={addHeaderItem}>
              + 添加
            </FormButton>
          </div>
          {profile.headerItems.length === 0 ? (
            <EmptyState>暂无头部信息</EmptyState>
          ) : (
            <div className="header-item-list">
              {profile.headerItems.map((item) => (
                <div key={item.id} className="header-item-card">
                  <div className="header-item-main">
                    <TextInput
                      className="header-item-label"
                      controlSize="compact"
                      value={item.label}
                      onChange={(e) => updateHeaderItem(item.id, { label: e.target.value })}
                      placeholder="标签，如 求职意向"
                    />
                    <SelectInput
                      className="header-item-kind"
                      controlSize="compact"
                      value={item.kind}
                      options={HEADER_KIND_OPTIONS}
                      ariaLabel="头部信息类型"
                      onValueChange={(value) =>
                        updateHeaderItem(item.id, { kind: value as HeaderItemKind })
                      }
                    />
                    <TextInput
                      className="header-item-value"
                      controlSize="compact"
                      value={item.value}
                      onChange={(e) => updateHeaderItem(item.id, { value: e.target.value })}
                      placeholder={getValuePlaceholder(item.kind)}
                    />
                    <FormButton
                      size="icon"
                      variant="danger"
                      onClick={() => deleteHeaderItem(item.id)}
                      title="删除"
                      aria-label="删除头部信息"
                    >
                      ✕
                    </FormButton>
                  </div>
                  {item.kind === 'link' && (
                    <TextInput
                      type="url"
                      className="header-item-href"
                      controlSize="compact"
                      value={item.href ?? ''}
                      onChange={(e) => updateHeaderItem(item.id, { href: e.target.value })}
                      placeholder="https://..."
                    />
                  )}
                  <CheckboxField
                    className="header-item-option"
                    checked={item.showLabel}
                    onCheckedChange={(checked) =>
                      updateHeaderItem(item.id, { showLabel: checked })
                    }
                    label="预览中显示标签"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <FormField label="一句话简介(支持 Markdown)" span={2}>
          <MarkdownField
            value={profile.summary}
            onChange={(v) => update('summary', v)}
            placeholder="一句话总结你自己..."
          />
        </FormField>
      </FormCardBody>
    </FormCard>
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
