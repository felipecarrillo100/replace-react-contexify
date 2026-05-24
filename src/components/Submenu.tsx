import {
  useState,
  useRef,
  useLayoutEffect,
  useMemo,
  type FC,
  type ReactNode,
  type CSSProperties,
  type MouseEvent,
} from 'react';
import { cloneItem } from './cloneItem';
import { styles } from '../utils/styles';
import { cx } from '../utils/cx';
import type { MenuItemEventHandler, TriggerEvent } from '../types';

export interface SubmenuProps {
  /** Any valid node that can be rendered as the submenu label */
  label: ReactNode;
  /** Any valid node that can be rendered as submenu content */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Render a custom arrow */
  arrow?: ReactNode;
  /** Disable or not the Submenu. If a function is used, a boolean must be returned */
  disabled?: boolean | ((args: MenuItemEventHandler) => boolean);
  /** INTERNAL: Native event from context menu trigger */
  nativeEvent?: TriggerEvent;
  /** INTERNAL: Props passed from trigger */
  propsFromTrigger?: Record<string, unknown>;
}

interface SubmenuPosition {
  left?: string | number;
  right?: string | number;
  top?: string | number;
  bottom?: string | number;
}

const DEFAULT_ARROW = '▶';

/**
 * Check if the document or an element is in RTL mode
 */
const isRTL = (element?: HTMLElement | null): boolean => {
  if (typeof window === 'undefined') return false;
  const el = element || document.documentElement;
  return window.getComputedStyle(el).direction === 'rtl';
};

/**
 * Submenu component for nested menu items.
 * Automatically positions itself to stay within viewport.
 * Supports RTL (Right-to-Left) layouts.
 */
export const Submenu: FC<SubmenuProps> = ({
  label,
  children,
  className,
  style,
  arrow = DEFAULT_ARROW,
  disabled = false,
  nativeEvent,
  propsFromTrigger,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<SubmenuPosition | null>(null);

  // Compute disabled state
  const isDisabled = useMemo(() => {
    if (typeof disabled === 'function') {
      return disabled({
        event: nativeEvent as TriggerEvent,
        props: { ...propsFromTrigger },
      });
    }
    return disabled;
  }, [disabled, nativeEvent, propsFromTrigger]);

  // Position submenu after mount - handles both LTR and RTL
  useLayoutEffect(() => {
    if (!menuRef.current || !itemRef.current) return;

    const { innerWidth, innerHeight } = window;
    const rect = menuRef.current.getBoundingClientRect();
    const rtl = isRTL(itemRef.current);
    const newPosition: SubmenuPosition = {};

    // Horizontal positioning - considers RTL
    if (rtl) {
      // RTL: Default to left (right: 100%), fallback to right if no space
      if (rect.left > 0) {
        newPosition.right = '100%';
        newPosition.left = undefined;
      } else {
        newPosition.left = '100%';
        newPosition.right = undefined;
      }
    } else {
      // LTR: Default to right (left: 100%), fallback to left if no space
      if (rect.right < innerWidth) {
        newPosition.left = '100%';
        newPosition.right = undefined;
      } else {
        newPosition.right = '100%';
        newPosition.left = undefined;
      }
    }

    // Vertical positioning (same for both directions)
    if (rect.bottom > innerHeight) {
      newPosition.bottom = 0;
      newPosition.top = 'initial';
    } else {
      newPosition.bottom = 'initial';
      newPosition.top = 0;
    }

    setPosition(newPosition);
  }, []);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const cssClasses = cx(styles.item, styles.itemSubmenu, className, {
    [styles.itemDisabled]: isDisabled,
  });

  // Hide submenu until position is calculated to prevent flash
  const submenuStyle: CSSProperties = {
    ...style,
    ...(position || {}),
    // Keep submenu invisible until position is calculated
    visibility: position ? 'visible' : 'hidden',
  };

  return (
    <div className={cssClasses} role="menuitem" aria-haspopup="true" ref={itemRef}>
      <div className={styles.itemContent} onClick={handleClick}>
        {label}
        <span className={styles.submenuArrow}>{arrow}</span>
      </div>
      <div className={styles.submenu} ref={menuRef} style={submenuStyle} role="menu">
        {cloneItem(children, {
          propsFromTrigger,
          nativeEvent: nativeEvent as TriggerEvent,
        })}
      </div>
    </div>
  );
};
