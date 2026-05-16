import type { FreeformSection } from '../../types/schema';
import { useDialog } from '../Dialog';
import { FormButton } from './FormButton';
import {
  FormCard,
  FormCardActions,
  FormCardBody,
  FormCardHeader,
} from './FormCard';
import { InlineTextInput } from './FormControls';
import { MarkdownField } from './MarkdownField';
import { MoveButtons } from './MoveButtons';

interface FreeformSectionCardProps {
  section: FreeformSection;
  index: number;
  total: number;
  onChange: (next: FreeformSection) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export function FreeformSectionCard({
  section,
  index,
  total,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: FreeformSectionCardProps) {
  const { confirm } = useDialog();

  function setTitle(title: string) {
    onChange({ ...section, title });
  }

  function setBody(body: string) {
    onChange({ ...section, body });
  }

  async function handleRemove() {
    const ok = await confirm({
      title: '删除区块',
      message: `确定要删除"${section.title || '未命名区块'}"吗?`,
      confirmText: '删除',
      danger: true,
    });
    if (ok) onRemove();
  }

  return (
    <FormCard variant="section">
      <FormCardHeader variant="section">
        <InlineTextInput
          className="section-title-input"
          value={section.title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="区块标题(如:技能清单)"
        />
        <FormCardActions variant="section">
          <span className="section-type-tag freeform">自由内容</span>
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
            title="删除区块"
            aria-label="删除区块"
          >
            ✕
          </FormButton>
        </FormCardActions>
      </FormCardHeader>
      <FormCardBody variant="section">
        <MarkdownField
          value={section.body}
          onChange={setBody}
          placeholder="支持 Markdown 语法..."
          minHeight={120}
        />
      </FormCardBody>
    </FormCard>
  );
}
