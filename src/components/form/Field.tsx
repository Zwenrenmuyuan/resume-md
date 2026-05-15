import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  children: ReactNode;
  span?: 1 | 2;
}

export function Field({ label, children, span = 1 }: FieldProps) {
  return (
    <label className={`form-field${span === 2 ? ' form-field-wide' : ''}`}>
      <span className="form-field-label">{label}</span>
      {children}
    </label>
  );
}
