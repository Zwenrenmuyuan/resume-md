import type { Profile } from '../../types/schema';
import { newId } from '../../utils/id';
import { Field } from './Field';
import { MarkdownField } from './MarkdownField';

interface ProfileFormProps {
  profile: Profile;
  onChange: (next: Profile) => void;
}

export function ProfileForm({ profile, onChange }: ProfileFormProps) {
  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    onChange({ ...profile, [key]: value });
  }

  function updateLink(id: string, patch: Partial<{ label: string; url: string }>) {
    update(
      'links',
      profile.links.map((l) => (l.id === id ? { ...l, ...patch } : l))
    );
  }

  function addLink() {
    update('links', [...profile.links, { id: newId(), label: '', url: '' }]);
  }

  function removeLink(id: string) {
    update(
      'links',
      profile.links.filter((l) => l.id !== id)
    );
  }

  return (
    <section className="form-card">
      <header className="form-card-header">
        <h2>个人信息</h2>
      </header>
      <div className="form-card-body">
        <div className="form-row">
          <Field label="姓名">
            <input
              type="text"
              value={profile.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="张三"
            />
          </Field>
          <Field label="坐标">
            <input
              type="text"
              value={profile.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder="上海"
            />
          </Field>
        </div>
        <div className="form-row">
          <Field label="邮箱">
            <input
              type="email"
              value={profile.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="you@example.com"
            />
          </Field>
          <Field label="电话">
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="138-0000-0000"
            />
          </Field>
        </div>

        <div className="form-subsection">
          <div className="form-subsection-header">
            <span className="form-subsection-title">链接</span>
            <button type="button" className="btn-mini" onClick={addLink}>
              + 添加
            </button>
          </div>
          {profile.links.length === 0 ? (
            <p className="form-empty">暂无链接</p>
          ) : (
            <div className="link-list">
              {profile.links.map((link) => (
                <div key={link.id} className="link-row">
                  <input
                    type="text"
                    className="link-label"
                    value={link.label}
                    onChange={(e) => updateLink(link.id, { label: e.target.value })}
                    placeholder="GitHub"
                  />
                  <input
                    type="url"
                    className="link-url"
                    value={link.url}
                    onChange={(e) => updateLink(link.id, { url: e.target.value })}
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    className="btn-icon danger"
                    onClick={() => removeLink(link.id)}
                    title="删除"
                  >
                    ✕
                  </button>
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
