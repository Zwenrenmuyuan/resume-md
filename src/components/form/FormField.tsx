import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  span?: 1 | 2;
  wide?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
}

export function FormField({
  label,
  children,
  span = 1,
  wide = false,
  hint,
  error,
  htmlFor,
}: FormFieldProps) {
  const className = [
    'form-field',
    span === 2 || wide ? 'form-field-wide' : '',
    error ? 'form-field-invalid' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {htmlFor ? (
        <label className="form-field-label" htmlFor={htmlFor}>
          {label}
        </label>
      ) : (
        <span className="form-field-label">{label}</span>
      )}
      {children}
      {hint && <span className="form-field-hint">{hint}</span>}
      {error && <span className="form-field-error">{error}</span>}
    </>
  );

  if (htmlFor) {
    return <div className={className}>{content}</div>;
  }

  return <label className={className}>{content}</label>;
}
