import type { ButtonHTMLAttributes } from 'react';

type FormButtonSize = 'mini' | 'icon' | 'add' | 'addSection';
type FormButtonVariant = 'default' | 'danger';

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: FormButtonSize;
  variant?: FormButtonVariant;
}

const SIZE_CLASS: Record<FormButtonSize, string> = {
  mini: 'btn-mini',
  icon: 'btn-icon',
  add: 'btn-add',
  addSection: 'btn-add-section',
};

export function FormButton({
  size = 'mini',
  variant = 'default',
  className,
  type = 'button',
  ...props
}: FormButtonProps) {
  const classes = [SIZE_CLASS[size], variant === 'danger' ? 'danger' : '', className]
    .filter(Boolean)
    .join(' ');

  return <button type={type} className={classes} {...props} />;
}
