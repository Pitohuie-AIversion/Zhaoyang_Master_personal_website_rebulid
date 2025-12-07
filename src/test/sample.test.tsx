import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

const TestComponent = () => {
  return <div>Hello World</div>;
};

describe('App', () => {
  it('renders hello world', () => {
    render(<TestComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('performs basic arithmetic', () => {
    expect(1 + 1).toBe(2);
  });
});
