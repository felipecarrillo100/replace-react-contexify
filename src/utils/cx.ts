/**
 * Utility function to conditionally join class names together.
 * Replacement for the 'classnames' package.
 * 
 * @example
 * cx('foo', 'bar') // => 'foo bar'
 * cx('foo', { bar: true }) // => 'foo bar'
 * cx({ foo: true, bar: false }) // => 'foo'
 * cx('foo', null, undefined, false, 'bar') // => 'foo bar'
 */
export function cx(
  ...args: Array<string | Record<string, boolean | undefined | null> | undefined | null | false>
): string {
  const classes: string[] = [];

  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (typeof arg === 'object') {
      for (const key in arg) {
        if (Object.prototype.hasOwnProperty.call(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}

