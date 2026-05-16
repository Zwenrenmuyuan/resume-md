import type { ReactNode } from 'react';

interface EmptyStateProps {
  children: ReactNode;
}

export function EmptyState({ children }: EmptyStateProps) {
  return <p className="form-empty">{children}</p>;
}
