import type { FC, ReactNode, CSSProperties } from 'react';
import { styles } from '../utils/styles';
import { cx } from '../utils/cx';

export interface IconFontProps {
  /** Any valid node that can be rendered */
  children?: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
}

/**
 * IconFont component for displaying icons in menu items.
 */
export const IconFont: FC<IconFontProps> = ({ className, style, children }) => (
  <i className={cx(styles.itemIcon, className)} style={style}>
    {children ?? ''}
  </i>
);
