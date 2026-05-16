import type { TimelineItem } from '../../types/schema';
import { useDialog } from '../Dialog';
import { FormButton } from './FormButton';
import {
  FormCard,
  FormCardActions,
  FormCardBody,
  FormCardHeader,
} from './FormCard';
import { TextInput } from './FormControls';
import { FormField } from './FormField';
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
    <FormCard variant="item">
      <FormCardHeader variant="item">
        <span className="item-card-handle">条目 {index + 1}</span>
        <FormCardActions variant="item">
          <MoveButtons
            canUp={index > 0}
            canDown={index < total - 1}
            onUp={onMoveUp}
            onDown={onMoveDown}
          />
          <FormButton
            size="icon"
            variant="danger"
            onClick={handleRemove}
            title="删除"
            aria-label="删除条目"
          >
            ✕
          </FormButton>
        </FormCardActions>
      </FormCardHeader>
      <FormCardBody variant="item">
        <div className="form-row">
          <FormField label="标题(公司/学校/项目名)">
            <TextInput
              value={item.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="XX 科技"
            />
          </FormField>
          <FormField label="副标题(职位/专业/标签)">
            <TextInput
              value={item.subtitle}
              onChange={(e) => update('subtitle', e.target.value)}
              placeholder="高级前端工程师"
            />
          </FormField>
        </div>
        <div className="form-row">
          <FormField label="开始时间">
            <TextInput
              value={item.start}
              onChange={(e) => update('start', e.target.value)}
              placeholder="2023-06"
            />
          </FormField>
          <FormField label="结束时间">
            <TextInput
              value={item.end}
              onChange={(e) => update('end', e.target.value)}
              placeholder="至今"
            />
          </FormField>
        </div>
        <FormField label="描述(支持 Markdown)" span={2}>
          <MarkdownField
            value={item.description}
            onChange={(v) => update('description', v)}
            placeholder="- 主导了 ...&#10;- 落地了 ..."
            minHeight={90}
          />
        </FormField>
      </FormCardBody>
    </FormCard>
  );
}
