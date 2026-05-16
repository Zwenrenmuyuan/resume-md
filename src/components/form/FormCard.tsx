import type { ReactNode } from 'react';

type FormCardVariant = 'profile' | 'section' | 'item';

interface FormCardProps {
  variant?: FormCardVariant;
  children: ReactNode;
}

interface FormCardPartProps {
  variant?: FormCardVariant;
  children: ReactNode;
}

const CARD_CLASS: Record<FormCardVariant, string> = {
  profile: 'form-card',
  section: 'section-card',
  item: 'item-card',
};

const HEADER_CLASS: Record<FormCardVariant, string> = {
  profile: 'form-card-header',
  section: 'section-card-header',
  item: 'item-card-header',
};

const BODY_CLASS: Record<FormCardVariant, string> = {
  profile: 'form-card-body',
  section: 'section-card-body',
  item: 'item-card-body',
};

const ACTIONS_CLASS: Record<FormCardVariant, string> = {
  profile: 'form-card-actions',
  section: 'section-card-actions',
  item: 'item-card-actions',
};

export function FormCard({ variant = 'section', children }: FormCardProps) {
  const className = CARD_CLASS[variant];

  if (variant === 'item') {
    return <div className={className}>{children}</div>;
  }

  return <section className={className}>{children}</section>;
}

export function FormCardHeader({ variant = 'section', children }: FormCardPartProps) {
  return <header className={HEADER_CLASS[variant]}>{children}</header>;
}

export function FormCardBody({ variant = 'section', children }: FormCardPartProps) {
  return <div className={BODY_CLASS[variant]}>{children}</div>;
}

export function FormCardActions({ variant = 'section', children }: FormCardPartProps) {
  return <div className={ACTIONS_CLASS[variant]}>{children}</div>;
}
