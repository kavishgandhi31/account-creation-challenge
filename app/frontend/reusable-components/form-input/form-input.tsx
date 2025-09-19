import React, { ChangeEvent } from 'react';

interface FormInputProps {
  name: string;
  type: string;
  value: string;
  label: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  inputClassNames?: string;
  labelClassNames?: string;
}

export function FormInput({ name, type, value, required, label, onChange, onBlur, inputClassNames, labelClassNames }: FormInputProps) {
  const id = label.replace(/ /gm, '_');

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    onBlur?.(event);
  }

  return (
    <div>
      <label htmlFor={id} className={labelClassNames}>{label}</label>
      <input
        name={name}
        type={type}
        id={id}
        className={inputClassNames}
        value={value}
        onChange={handleChange}
        required={required}
        onBlur={handleBlur}
      />
    </div>
  );
}
