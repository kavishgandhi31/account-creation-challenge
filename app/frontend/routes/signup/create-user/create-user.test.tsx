import { describe, test } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CreateUser } from './create-user';

describe('CreateUser', () => {
  test('render', () => {
    render(<CreateUser />, { wrapper: BrowserRouter });
    expect(screen.getByLabelText('First name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last name')).toBeInTheDocument();
  });

  test('updates input value on change', () => {
    render(<CreateUser />, { wrapper: BrowserRouter });
    const firstNameInput = screen.getByLabelText('First name') as HTMLInputElement;
    fireEvent.change(firstNameInput, { target: { value: 'Alice' } });
    expect(firstNameInput.value).toBe('Alice');
  });
});
