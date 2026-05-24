import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  SquareIcon,
  CheckSquareIcon,
  CaretRightIcon,
  CheckboxIcon,
} from '../components/icons';

describe('Icons', () => {
  describe('SquareIcon', () => {
    it('should render an SVG', () => {
      const { container } = render(<SquareIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should have default size of 16', () => {
      const { container } = render(<SquareIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '16');
      expect(svg).toHaveAttribute('height', '16');
    });

    it('should accept custom size', () => {
      const { container } = render(<SquareIcon size={24} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    it('should apply custom className', () => {
      const { container } = render(<SquareIcon className="custom-icon" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-icon');
    });
  });

  describe('CheckSquareIcon', () => {
    it('should render an SVG with checkmark', () => {
      const { container } = render(<CheckSquareIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
      expect(container.querySelector('polyline')).toBeInTheDocument();
    });
  });

  describe('CaretRightIcon', () => {
    it('should render an SVG', () => {
      const { container } = render(<CaretRightIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should have default size of 12', () => {
      const { container } = render(<CaretRightIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '12');
      expect(svg).toHaveAttribute('height', '12');
    });
  });

  describe('CheckboxIcon', () => {
    it('should render SquareIcon when unchecked', () => {
      const { container } = render(<CheckboxIcon checked={false} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // SquareIcon has a rect but no polyline
      expect(container.querySelector('rect')).toBeInTheDocument();
    });

    it('should render CheckSquareIcon when checked', () => {
      const { container } = render(<CheckboxIcon checked={true} />);
      // CheckSquareIcon has both rect and polyline
      expect(container.querySelector('rect')).toBeInTheDocument();
      expect(container.querySelector('polyline')).toBeInTheDocument();
    });

    it('should apply reduced opacity when disabled', () => {
      const { container } = render(<CheckboxIcon checked={false} disabled />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveStyle({ opacity: '0.5' });
    });

    it('should have full opacity when not disabled', () => {
      const { container } = render(<CheckboxIcon checked={false} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveStyle({ opacity: '1' });
    });
  });
});

