import { eventManager } from './eventManager';
import { HIDE_ALL, DISPLAY_MENU } from './actions';
import type { MenuId } from '../types';
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';

export interface ShowContextMenuParams {
  /** Menu identifier */
  id: MenuId;
  /** Native or React event (provides position) */
  event?: MouseEvent | TouchEvent | ReactMouseEvent | ReactTouchEvent;
  /** X coordinate (alternative to event) */
  x?: number;
  /** Y coordinate (alternative to event) */
  y?: number;
  /** Additional props passed to menu items */
  props?: Record<string, unknown>;
}

/**
 * Create a synthetic event-like object for programmatic menu display
 */
function createSyntheticEvent(x: number, y: number): MouseEvent {
  return {
    clientX: x,
    clientY: y,
    button: 2,
    buttons: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    bubbles: true,
    cancelable: true,
    defaultPrevented: true,
    type: 'contextmenu',
    stopPropagation: () => {},
    preventDefault: () => {},
  } as unknown as MouseEvent;
}

export interface ContextMenuAPI {
  /**
   * Show a context menu
   * @param params - Show parameters including id, event or x/y coordinates, and optional props
   */
  show: (params: ShowContextMenuParams) => void;
  /**
   * Hide all open context menus
   */
  hideAll: () => void;
}

/**
 * Programmatic API for showing and hiding context menus.
 *
 * @example
 * // Using with an event
 * contextMenu.show({ id: 'menu1', event: e });
 *
 * @example
 * // Using with coordinates
 * contextMenu.show({ id: 'menu1', x: 100, y: 200, props: { data: 'value' } });
 *
 * @example
 * // Hide all menus
 * contextMenu.hideAll();
 */
export const contextMenu: ContextMenuAPI = {
  show({ id, event, x, y, props = {} }) {
    let nativeEvent: MouseEvent | TouchEvent;

    if (event) {
      // Extract native event from React synthetic event if needed
      const syntheticEvent = event as { nativeEvent?: MouseEvent | TouchEvent };
      nativeEvent = syntheticEvent.nativeEvent ?? (event as MouseEvent | TouchEvent);
    } else if (typeof x === 'number' && typeof y === 'number') {
      // Create synthetic event from coordinates
      nativeEvent = createSyntheticEvent(x, y);
    } else {
      console.warn('contextMenu.show() requires either an event or x/y coordinates');
      return;
    }

    eventManager.emit(DISPLAY_MENU(id), nativeEvent, props);
  },

  hideAll() {
    eventManager.emit(HIDE_ALL);
  },
};
