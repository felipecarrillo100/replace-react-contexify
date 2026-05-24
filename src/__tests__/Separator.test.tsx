import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Separator } from '../components/Separator';

describe('Separator', () => {
  it('should render a separator div', () => {
    const { container } = render(<Separator />);
    
    const separator = container.querySelector('.react-contexify__separator');
    expect(separator).toBeInTheDocument();
  });

  it('should have the correct class name', () => {
    const { container } = render(<Separator />);
    
    const separator = container.firstChild;
    expect(separator).toHaveClass('react-contexify__separator');
  });
});

