import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Item } from '../components/Item';
import type { TriggerEvent } from '../types';

describe('Item', () => {
  const mockEvent = {
    clientX: 100,
    clientY: 200,
    type: 'contextmenu',
  } as TriggerEvent;

  it('should render children', () => {
    render(<Item>Test Item</Item>);
    
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('should have menuitem role', () => {
    render(<Item>Test Item</Item>);
    
    expect(screen.getByRole('menuitem')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <Item onClick={handleClick} nativeEvent={mockEvent}>
        Clickable Item
      </Item>
    );
    
    fireEvent.click(screen.getByRole('menuitem'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith({
      event: mockEvent,
      props: {},
    });
  });

  it('should pass data in onClick callback', () => {
    const handleClick = vi.fn();
    const testData = { id: 123, name: 'test' };
    
    render(
      <Item onClick={handleClick} data={testData} nativeEvent={mockEvent}>
        Item with Data
      </Item>
    );
    
    fireEvent.click(screen.getByRole('menuitem'));
    
    expect(handleClick).toHaveBeenCalledWith({
      event: mockEvent,
      props: testData,
    });
  });

  it('should apply disabled class when disabled is true', () => {
    render(<Item disabled>Disabled Item</Item>);
    
    const item = screen.getByRole('menuitem');
    expect(item).toHaveClass('react-contexify__item--disabled');
    expect(item).toHaveAttribute('aria-disabled', 'true');
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Item onClick={handleClick} disabled>
        Disabled Item
      </Item>
    );
    
    fireEvent.click(screen.getByRole('menuitem'));
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should compute disabled from function', () => {
    const disabledFn = vi.fn(() => true);
    
    render(
      <Item disabled={disabledFn} nativeEvent={mockEvent} propsFromTrigger={{ test: true }}>
        Conditionally Disabled
      </Item>
    );
    
    expect(disabledFn).toHaveBeenCalledWith({
      event: mockEvent,
      props: { test: true },
    });
    
    const item = screen.getByRole('menuitem');
    expect(item).toHaveClass('react-contexify__item--disabled');
  });

  it('should apply custom className', () => {
    render(<Item className="custom-class">Custom Item</Item>);
    
    const item = screen.getByRole('menuitem');
    expect(item).toHaveClass('custom-class');
    expect(item).toHaveClass('react-contexify__item');
  });

  it('should apply custom style', () => {
    render(<Item style={{ color: 'red' }}>Styled Item</Item>);
    
    const item = screen.getByRole('menuitem');
    expect(item).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });
});

