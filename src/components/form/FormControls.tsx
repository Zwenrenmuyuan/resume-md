import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

type ControlSize = 'default' | 'compact';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  controlSize?: ControlSize;
}

interface SelectOption {
  value: string;
  label: ReactNode;
}

interface SelectInputProps {
  controlSize?: ControlSize;
  className?: string;
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  ariaLabel?: string;
  disabled?: boolean;
}

interface CheckboxFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { controlSize = 'default', className, type = 'text', ...props },
  ref
) {
  return (
    <input
      {...props}
      ref={ref}
      type={type}
      className={controlClassName('form-control-text', controlSize, className)}
    />
  );
});

export function InlineTextInput({ className, ...props }: TextInputProps) {
  return <TextInput {...props} className={joinClassNames('inline-text-input', className)} />;
}

export function SelectInput({
  controlSize = 'default',
  className,
  value,
  options,
  onValueChange,
  ariaLabel,
  disabled = false,
}: SelectInputProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const listboxId = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function handleButtonKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
    }
  }

  function handleSelect(nextValue: string) {
    onValueChange(nextValue);
    setOpen(false);
  }

  return (
    <span
      ref={rootRef}
      className={joinClassNames(
        'select-field',
        open ? 'select-field-open' : '',
        controlSize === 'compact' ? 'select-field-compact' : '',
        className
      )}
    >
      <button
        type="button"
        disabled={disabled}
        className={controlClassName('form-control-select', controlSize)}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleButtonKeyDown}
      >
        <span className="select-field-value">{selected?.label ?? value}</span>
      </button>
      <span className="select-field-arrow" aria-hidden="true" />
      {open && (
        <span id={listboxId} className="select-field-menu" role="listbox">
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                className={`select-field-option${active ? ' active' : ''}`}
                role="option"
                aria-selected={active}
                onClick={() => handleSelect(option.value)}
              >
                <span className="select-field-option-check" aria-hidden="true">
                  {active ? '✓' : ''}
                </span>
                <span className="select-field-option-label">{option.label}</span>
              </button>
            );
          })}
        </span>
      )}
    </span>
  );
}

export function CheckboxField({
  label,
  className,
  onChange,
  onCheckedChange,
  ...props
}: CheckboxFieldProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange?.(e);
    onCheckedChange?.(e.target.checked);
  }

  return (
    <label className={joinClassNames('checkbox-field', className)}>
      <input {...props} type="checkbox" onChange={handleChange} />
      <span className="checkbox-field-box" aria-hidden="true" />
      <span className="checkbox-field-label">{label}</span>
    </label>
  );
}

export const FileInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function FileInput({ className, ...props }, ref) {
    return (
      <input
        {...props}
        ref={ref}
        type="file"
        className={joinClassNames('file-input', className)}
      />
    );
  }
);

function controlClassName(
  kind: string,
  controlSize: ControlSize,
  className?: string
) {
  return joinClassNames(
    'form-control',
    kind,
    controlSize === 'compact' ? 'form-control-compact' : '',
    className
  );
}

function joinClassNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
