import { FormButton } from './FormButton';

interface SectionAdderProps {
  onAdd: (type: 'timeline' | 'freeform') => void;
}

export function SectionAdder({ onAdd }: SectionAdderProps) {
  return (
    <div className="section-adder">
      <span className="section-adder-label">+ 新增区块</span>
      <div className="section-adder-buttons">
        <FormButton size="addSection" onClick={() => onAdd('timeline')}>
          时间条目
          <small>(教育/工作/项目)</small>
        </FormButton>
        <FormButton size="addSection" onClick={() => onAdd('freeform')}>
          自由内容
          <small>(技能/评价等)</small>
        </FormButton>
      </div>
    </div>
  );
}
