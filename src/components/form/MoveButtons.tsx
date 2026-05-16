import { FormButton } from './FormButton';

interface MoveButtonsProps {
  canUp: boolean;
  canDown: boolean;
  onUp: () => void;
  onDown: () => void;
}

export function MoveButtons({ canUp, canDown, onUp, onDown }: MoveButtonsProps) {
  return (
    <>
      <FormButton
        size="icon"
        disabled={!canUp}
        onClick={onUp}
        title="上移"
        aria-label="上移"
      >
        ▲
      </FormButton>
      <FormButton
        size="icon"
        disabled={!canDown}
        onClick={onDown}
        title="下移"
        aria-label="下移"
      >
        ▼
      </FormButton>
    </>
  );
}
