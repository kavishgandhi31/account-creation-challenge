import React, { ReactNode } from 'react';

interface FormButtonProps {
    type?: 'button' | 'submit';
    href?: string;
    disabled?: boolean;
    children: ReactNode;
    classNames?: string;
}

export function FormButton({ children, type, disabled, classNames }: FormButtonProps) {
  return (
    <button type={type} disabled={disabled} className={classNames}>
      {children}
    </button>
  );
}
