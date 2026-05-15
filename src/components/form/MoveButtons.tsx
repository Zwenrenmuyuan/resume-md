interface MoveButtonsProps {
  canUp: boolean;
  canDown: boolean;
  onUp: () => void;
  onDown: () => void;
}

export function MoveButtons({ canUp, canDown, onUp, onDown }: MoveButtonsProps) {
  return (
    <>
      <button
        type="button"
        className="btn-icon"
        disabled={!canUp}
        onClick={onUp}
        title="上移"
        aria-label="上移"
      >
        ▲
      </button>
      <button
        type="button"
        className="btn-icon"
        disabled={!canDown}
        onClick={onDown}
        title="下移"
        aria-label="下移"
      >
        ▼
      </button>
    </>
  );
}
