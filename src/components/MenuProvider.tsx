import {
  useRef,
  useCallback,
  createElement,
  Children,
  cloneElement,
  isValidElement,
  type FC,
  type ReactNode,
  type SyntheticEvent,
  type ReactElement,
  type CSSProperties,
} from 'react';
import { DISPLAY_MENU } from '../utils/actions';
import { eventManager } from '../utils/eventManager';
import type { MenuId } from '../types';

export interface MenuProviderProps {
  /** Unique id to identify the menu. Use to trigger the corresponding menu */
  id: MenuId;
  /** Any valid node that can be rendered */
  children: ReactNode;
  /** Component type to render as wrapper (default: 'div') */
  component?: ReactNode | ((args: Record<string, unknown>) => ReactNode);
  /** Render props pattern alternative */
  render?: (args: Record<string, unknown>) => ReactNode;
  /** React event name to trigger menu (default: 'onContextMenu') */
  event?: string;
  /** Store children refs (default: true) */
  storeRef?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Any valid object, data are passed to the menu item callback */
  data?: Record<string, unknown>;
}

/**
 * MenuProvider component wraps children and triggers a context menu on specified events.
 * Stores refs to children and passes data to menu items.
 */
export const MenuProvider: FC<MenuProviderProps> = ({
  id,
  children,
  component = 'div',
  render,
  event = 'onContextMenu',
  storeRef = true,
  className,
  style,
  data,
  ...rest
}) => {
  const childrenRefs = useRef<HTMLElement[]>([]);

  const handleEvent = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      eventManager.emit(DISPLAY_MENU(id), e.nativeEvent, {
        ref:
          childrenRefs.current.length === 1
            ? childrenRefs.current[0]
            : childrenRefs.current,
        ...data,
      });
    },
    [id, data]
  );

  const setChildRef = useCallback((ref: HTMLElement | null) => {
    if (ref !== null) {
      childrenRefs.current.push(ref);
    }
  }, []);

  const getChildren = useCallback(() => {
    // Reset refs before rendering
    childrenRefs.current = [];

    return Children.map(children, (child) => {
      if (isValidElement(child)) {
        return cloneElement(child as ReactElement<Record<string, unknown>>, {
          ...rest,
          ...(storeRef ? { ref: setChildRef } : {}),
        });
      }
      return child;
    });
  }, [children, rest, storeRef, setChildRef]);

  const attributes = {
    [event]: handleEvent,
    className,
    style,
  };

  // Render props pattern
  if (typeof render === 'function') {
    return render({ ...attributes, children: getChildren() }) as ReactElement;
  }

  // Default: create element wrapper
  return createElement(
    component as string,
    attributes,
    getChildren()
  );
};
