import { describe, it, expect } from 'vitest';
import { cx } from '../utils/cx';

describe('cx utility', () => {
  it('should join string arguments', () => {
    expect(cx('foo', 'bar')).toBe('foo bar');
  });

  it('should handle single string', () => {
    expect(cx('foo')).toBe('foo');
  });

  it('should filter out falsy values', () => {
    expect(cx('foo', null, undefined, false, 'bar')).toBe('foo bar');
  });

  it('should handle object with boolean values', () => {
    expect(cx({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('should handle mixed strings and objects', () => {
    expect(cx('foo', { bar: true, baz: false }, 'qux')).toBe('foo bar qux');
  });

  it('should handle empty arguments', () => {
    expect(cx()).toBe('');
  });

  it('should handle all falsy values', () => {
    expect(cx(null, undefined, false)).toBe('');
  });

  it('should handle object with undefined/null values', () => {
    expect(cx({ foo: true, bar: undefined, baz: null })).toBe('foo');
  });
});

