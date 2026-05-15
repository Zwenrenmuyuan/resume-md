import type { TimelineItem } from '../../types/schema';
import { useDialog } from '../Dialog';
import { Field } from './Field';
import { MarkdownField } from './MarkdownField';
import { MoveButtons } from './MoveButtons';

interface TimelineItemCardProps {
  item: TimelineItem;
  index: number;
  total: number;
  onChange: (next: TimelineItem) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export function TimelineItemCard({
  item,
  index,
  total,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: TimelineItemCardProps) {
  const { confirm } = useDialog();

  function update<K extends keyof TimelineItem>(key: K, value: TimelineItem[K]) {
    onChange({ ...item, [key]: value });
  }

  async function handleRemove() {
    const ok = await confirm({
      title: '删除条目',
      message: `确定要删除"${item.title || '未命名条目'}"吗?`,
      confirmText: '删除',
      danger: true,
    });
    if (ok) onRemove();
  }

  return (
    <div className="item-card">
      <div className="item-card-header">
        <span className="item-card-handle">条目 {index + 1}</span>
        <div className="item-card-actions">
          <MoveButtons
            canUp={index > 0}
            canDown={index < total - 1}
            onUp={onMoveUp}
            onDown={onMoveDown}
          />
          <button
            type="button"
            className="btn-icon danger"
            onClick={handleRemove}
            title="删除"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="item-card-body">
        <div className="form-row">
          <Field label="标题(公司/学校/项目名)">
            <input
              type="text"
              value={item.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="XX 科技"
            />
          </Field>
          <Field label="副标题(职位/专业/标签)">
            <input
              type="text"
              value={item.subtitle}
              onChange={(e) => update('subtitle', e.target.value)}
              placeholder="高级前端工程师"
            />
          </Field>
        </div>
        <div className="form-row">
          <Field label="开始时间">
            <input
              type="text"
              value={item.start}
              onChange={(e) => update('start', e.target.value)}
              placeholder="2023-06"
            />
          </Field>
          <Field label="结束时间">
            <input
              type="text"
              value={item.end}
              onChange={(e) => update('end', e.target.value)}
              placeholder="至今"
            />
          </Field>
        </div>
        <Field label="描述(支持 Markdown)" span={2}>
          <MarkdownField
            value={item.description}
            onChange={(v) => update('description', v)}
            placeholder="- 主导了 ...&#10;- 落地了 ..."
            minHeight={90}
          />
        </Field>
      </div>
    </div>
  );
}
