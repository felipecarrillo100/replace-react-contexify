import { describe, it, expect } from 'vitest';
import {
  isSeparator,
  isSubMenu,
  isSimpleItem,
  isPredefinedMessage,
  resolveLabel,
  type ContextMenuSimpleItem,
  type ContextMenuSeparator,
  type ContextMenuSubMenu,
} from '../types';

describe('Type Guards', () => {
  const separator: ContextMenuSeparator = { separator: true };
  const submenu: ContextMenuSubMenu = { label: 'Submenu', items: [] };
  const simpleItem: ContextMenuSimpleItem = { label: 'Simple Item' };

  describe('isSeparator', () => {
    it('should return true for separator items', () => {
      expect(isSeparator(separator)).toBe(true);
    });

    it('should return false for non-separator items', () => {
      expect(isSeparator(submenu)).toBe(false);
      expect(isSeparator(simpleItem)).toBe(false);
    });
  });

  describe('isSubMenu', () => {
    it('should return true for submenu items', () => {
      expect(isSubMenu(submenu)).toBe(true);
    });

    it('should return false for non-submenu items', () => {
      expect(isSubMenu(separator)).toBe(false);
      expect(isSubMenu(simpleItem)).toBe(false);
    });
  });

  describe('isSimpleItem', () => {
    it('should return true for simple items', () => {
      expect(isSimpleItem(simpleItem)).toBe(true);
    });

    it('should return false for separators and submenus', () => {
      expect(isSimpleItem(separator)).toBe(false);
      expect(isSimpleItem(submenu)).toBe(false);
    });
  });

  describe('isPredefinedMessage', () => {
    it('should return true for predefined message objects', () => {
      expect(isPredefinedMessage({ id: 'test.id', defaultMessage: 'Test' })).toBe(true);
      expect(isPredefinedMessage({ id: 'test.id' })).toBe(true);
    });

    it('should return false for string labels', () => {
      expect(isPredefinedMessage('Simple string')).toBe(false);
    });
  });
});

describe('resolveLabel', () => {
  it('should return empty string for undefined label', () => {
    expect(resolveLabel(undefined)).toBe('');
  });

  it('should return string label as-is', () => {
    expect(resolveLabel('Hello World')).toBe('Hello World');
  });

  it('should use formatMessage when provided', () => {
    const formatter = (msg: { id: string }) => `Translated: ${msg.id}`;
    expect(resolveLabel({ id: 'test.id' }, formatter)).toBe('Translated: test.id');
  });

  it('should use defaultMessage when no formatter provided', () => {
    expect(resolveLabel({ id: 'test.id', defaultMessage: 'Default Text' })).toBe('Default Text');
  });

  it('should use id when no formatter and no defaultMessage', () => {
    expect(resolveLabel({ id: 'test.id' })).toBe('test.id');
  });
});

