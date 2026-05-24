import { useMemo, type FC, type ReactNode, type CSSProperties, type MouseEvent } from 'react';
import { styles } from '../utils/styles';
import { cx } from '../utils/cx';
import type { MenuItemEventHandler, TriggerEvent } from '../types';

export interface ItemProps {
  /** Any valid node that can be rendered */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Passed to the Item onClick callback. Accessible via `props` */
  data?: Record<string, unknown>;
  /** Disable or not the Item. If a function is used, a boolean must be returned */
  disabled?: boolean | ((args: MenuItemEventHandler) => boolean);
  /**
   * Callback when the current Item is clicked.
   * `({ event, props }) => ...`
   */
  onClick?: (args: MenuItemEventHandler) => void;
  /** INTERNAL: Native event from context menu trigger */
  nativeEvent?: TriggerEvent;
  /** INTERNAL: Props passed from trigger */
  propsFromTrigger?: Record<string, unknown>;
}

/**
 * Item component for individual menu entries.
 * Supports click handlers, disabled state (static or computed), and data passing.
 */
export const Item: FC<ItemProps> = ({
  children,
  className,
  style,
  data,
  disabled = false,
  onClick,
  nativeEvent,
  propsFromTrigger,
}) => {
  // Compute disabled state (can be boolean or function)
  const isDisabled = useMemo(() => {
    if (typeof disabled === 'function') {
      return disabled({
        event: nativeEvent as TriggerEvent,
        props: { ...propsFromTrigger, ...data },
      });
    }
    return disabled;
  }, [disabled, nativeEvent, propsFromTrigger, data]);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (isDisabled) {
      e.stopPropagation();
      return;
    }
    onClick?.({
      event: nativeEvent as TriggerEvent,
      props: { ...propsFromTrigger, ...data },
    });
  };

  const cssClasses = cx(styles.item, className, {
    [styles.itemDisabled]: isDisabled,
  });

  return (
    <div
      className={cssClasses}
      style={style}
      onClick={handleClick}
      role="menuitem"
      aria-disabled={isDisabled}
    >
      <div className={styles.itemContent}>{children}</div>
    </div>
  );
};
