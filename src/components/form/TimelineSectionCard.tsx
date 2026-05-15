import type { TimelineItem, TimelineSection } from '../../types/schema';
import { newId } from '../../utils/id';
import { useDialog } from '../Dialog';
import { MoveButtons } from './MoveButtons';
import { TimelineItemCard } from './TimelineItemCard';

interface TimelineSectionCardProps {
  section: TimelineSection;
  index: number;
  total: number;
  onChange: (next: TimelineSection) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export function TimelineSectionCard({
  section,
  index,
  total,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: TimelineSectionCardProps) {
  const { confirm } = useDialog();

  function setItems(items: TimelineItem[]) {
    onChange({ ...section, items });
  }

  function setTitle(title: string) {
    onChange({ ...section, title });
  }

  function updateItem(id: string, next: TimelineItem) {
    setItems(section.items.map((it) => (it.id === id ? next : it)));
  }

  function moveItem(id: string, dir: -1 | 1) {
    const i = section.items.findIndex((it) => it.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= section.items.length) return;
    const next = [...section.items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  }

  function removeItem(id: string) {
    setItems(section.items.filter((it) => it.id !== id));
  }

  function addItem() {
    const item: TimelineItem = {
      id: newId('i_'),
      title: '',
      subtitle: '',
      start: '',
      end: '',
      description: '',
    };
    setItems([...section.items, item]);
  }

  async function handleRemoveSection() {
    const ok = await confirm({
      title: '删除区块',
      message: `确定要删除整个"${section.title || '未命名区块'}"吗?\n区块内的所有条目都会一并删除。`,
      confirmText: '删除',
      danger: true,
    });
    if (ok) onRemove();
  }

  return (
    <section className="section-card">
      <header className="section-card-header">
        <input
          type="text"
          className="section-title-input"
          value={section.title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="区块标题(如:工作经历)"
        />
        <div className="section-card-actions">
          <span className="section-type-tag">时间条目</span>
          <MoveButtons
            canUp={index > 0}
            canDown={index < total - 1}
            onUp={onMoveUp}
            onDown={onMoveDown}
          />
          <button
            type="button"
            className="btn-icon danger"
            onClick={handleRemoveSection}
            title="删除区块"
          >
            ✕
          </button>
        </div>
      </header>
      <div className="section-card-body">
        {section.items.map((item, i) => (
          <TimelineItemCard
            key={item.id}
            item={item}
            index={i}
            total={section.items.length}
            onChange={(next) => updateItem(item.id, next)}
            onMoveUp={() => moveItem(item.id, -1)}
            onMoveDown={() => moveItem(item.id, 1)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
        <button type="button" className="btn-add" onClick={addItem}>
          + 添加条目
        </button>
      </div>
    </section>
  );
}
