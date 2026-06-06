/* global: window */
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FC,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { cloneItem } from './cloneItem';
import { Portal } from './Portal';
import { HIDE_ALL, DISPLAY_MENU } from '../utils/actions';
import { styles } from '../utils/styles';
import { cx } from '../utils/cx';
import { eventManager } from '../utils/eventManager';
import type { TriggerEvent, StyleProps, MenuId } from '../types';

const KEY = {
  ENTER: 13,
  ESC: 27,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
} as const;

/**
 * Check if an element is in RTL mode
 */
const isRTL = (element?: HTMLElement | null): boolean => {
  if (typeof window === 'undefined') return false;
  const el = element || document.documentElement;
  return window.getComputedStyle(el).direction === 'rtl';
};

export interface MenuProps extends StyleProps {
  /** Unique id to identify the menu. Use to Trigger the corresponding menu */
  id: MenuId;
  /** Any valid node that can be rendered */
  children: ReactNode;
  /**
   * Theme is appended to `react-contexify__theme--${given theme}`.
   * Built-in themes are `light` and `dark`
   */
  theme?: string;
  /**
   * Animation is appended to `.react-contexify__will-enter--${given animation}`
   * Built-in animations are fade, flip, pop, zoom
   */
  animation?: string;
  /** Invoked when the menu is shown */
  onShown?: () => void;
  /** Invoked when the menu is hidden */
  onHidden?: () => void;
  /** Invoked when the menu starts showing */
  onShow?: () => void;
  /** Invoked when the menu starts hiding */
  onHide?: () => void;
  /** Invoked when the menu visibility changes */
  onOpenChange?: (open: boolean) => void;
}

interface MenuState {
  x: number;
  y: number;
  visible: boolean;
  nativeEvent: TriggerEvent | null;
  propsFromTrigger: Record<string, unknown>;
  rtl: boolean;
}

/**
 * Menu component that displays a context menu.
 * Listens for display/hide events and positions itself at the trigger location.
 */
export const Menu: FC<MenuProps> = ({
  id,
  children,
  theme,
  animation,
  style,
  className,
  onShown,
  onHidden,
  onShow,
  onHide,
  onOpenChange,
}) => {
  const [state, setState] = useState<MenuState>({
    x: 0,
    y: 0,
    visible: false,
    nativeEvent: null,
    propsFromTrigger: {},
    rtl: false,
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const wasVisible = useRef(false);

  // Get mouse position from event (supports both mouse and touch)
  const getMousePosition = useCallback((e: TriggerEvent) => {
    const pos = {
      x: e.clientX,
      y: e.clientY,
    };

    if (
      e.type === 'touchend' &&
      (!pos.x || !pos.y) &&
      e.changedTouches &&
      e.changedTouches.length > 0
    ) {
      pos.x = e.changedTouches[0].clientX;
      pos.y = e.changedTouches[0].clientY;
    }

    if (!pos.x || pos.x < 0) pos.x = 0;
    if (!pos.y || pos.y < 0) pos.y = 0;

    return pos;
  }, []);

  // Adjust menu position to stay within viewport
  const setMenuPosition = useCallback(() => {
    if (!menuRef.current) return;

    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    const { offsetWidth: menuWidth, offsetHeight: menuHeight } = menuRef.current;

    setState((prev) => {
      let { x, y } = prev;

      if (x + menuWidth > windowWidth) {
        x -= x + menuWidth - windowWidth;
      }

      if (y + menuHeight > windowHeight) {
        y -= y + menuHeight - windowHeight;
      }

      return { ...prev, x, y };
    });
  }, []);

  // Hide menu handler
  const hide = useCallback((event?: Event) => {
    // Safari triggers a click event when you ctrl + trackpad
    // Firefox triggers a click event when right click occurs
    const e = event as KeyboardEvent & MouseEvent;

    if (
      typeof e !== 'undefined' &&
      (e.button === 2 || e.ctrlKey === true) &&
      e.type !== 'contextmenu'
    ) {
      return;
    }

    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  // Keyboard handler
  const handleKeyboard = useCallback(
    (e: KeyboardEvent) => {
      if (e.keyCode === KEY.ENTER || e.keyCode === KEY.ESC) {
        hide();
      }
    },
    [hide]
  );

  // Show menu handler
  const show = useCallback(
    (e: TriggerEvent, props: Record<string, unknown>) => {
      e.stopPropagation();
      eventManager.emit(HIDE_ALL);

      const { x, y } = getMousePosition(e);
      
      // Detect RTL from the trigger element
      const triggerElement = e.target as HTMLElement;
      const rtlMode = isRTL(triggerElement);

      setState({
        visible: true,
        x,
        y,
        nativeEvent: e,
        propsFromTrigger: props,
        rtl: rtlMode,
      });
    },
    [getMousePosition]
  );

  // Mouse enter/leave handlers for menu
  const onMouseEnter = useCallback(() => {
    window.removeEventListener('mousedown', hide);
  }, [hide]);

  const onMouseLeave = useCallback(() => {
    window.addEventListener('mousedown', hide);
  }, [hide]);

  // Bind/unbind window events
  const bindWindowEvent = useCallback(() => {
    window.addEventListener('resize', hide);
    window.addEventListener('contextmenu', hide);
    window.addEventListener('mousedown', hide);
    window.addEventListener('click', hide);
    window.addEventListener('scroll', hide);
    window.addEventListener('keydown', handleKeyboard);
  }, [hide, handleKeyboard]);

  const unBindWindowEvent = useCallback(() => {
    window.removeEventListener('resize', hide);
    window.removeEventListener('contextmenu', hide);
    window.removeEventListener('mousedown', hide);
    window.removeEventListener('click', hide);
    window.removeEventListener('scroll', hide);
    window.removeEventListener('keydown', handleKeyboard);
  }, [hide, handleKeyboard]);

  // Subscribe to events on mount
  useEffect(() => {
    const unsubDisplay = eventManager.on(DISPLAY_MENU(id), show);
    const unsubHideAll = eventManager.on(HIDE_ALL, hide);

    return () => {
      unsubDisplay();
      unsubHideAll();
      unBindWindowEvent();
    };
  }, [id, show, hide, unBindWindowEvent]);

  // Handle visibility changes
  useEffect(() => {
    if (state.visible && !wasVisible.current) {
      // Menu just became visible
      setMenuPosition();
      // Defer binding to avoid the triggering click from immediately hiding the menu
      const timeoutId = setTimeout(() => {
        bindWindowEvent();
      }, 0);
      onShown?.();
      onShow?.();
      onOpenChange?.(true);
      wasVisible.current = state.visible;
      return () => clearTimeout(timeoutId);
    } else if (!state.visible && wasVisible.current) {
      // Menu just became hidden
      unBindWindowEvent();
      onHidden?.();
      onHide?.();
      onOpenChange?.(false);
    }
    wasVisible.current = state.visible;
  }, [state.visible, setMenuPosition, bindWindowEvent, unBindWindowEvent, onShown, onHidden, onShow, onHide, onOpenChange]);

  const { visible, nativeEvent, propsFromTrigger, x, y, rtl } = state;

  const cssClasses = cx(styles.menu, className, {
    [styles.theme + theme]: !!theme,
    [styles.animationWillEnter + animation]: !!animation,
  });

  const menuStyle: CSSProperties = {
    ...style,
    left: x,
    top: y + 1,
    opacity: 1,
  };

  return (
    <Portal>
      {visible && (
        <div
          className={cssClasses}
          style={menuStyle}
          ref={menuRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          role="menu"
          dir={rtl ? 'rtl' : undefined}
          data-rtl={rtl || undefined}
        >
          <div>
            {cloneItem(children, {
              nativeEvent: nativeEvent as TriggerEvent,
              propsFromTrigger,
            })}
          </div>
        </div>
      )}
    </Portal>
  );
};
