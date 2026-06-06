import type { CSSProperties, ReactNode } from 'react';

/**
 * Mouse or Touch event that triggered the context menu
 */
export type TriggerEvent = MouseEvent & TouchEvent;

/**
 * Unique id to identify the menu. Use to Trigger the corresponding menu
 */
export type MenuId = string | number;

/**
 * Handler arguments passed to menu item callbacks
 */
export interface MenuItemEventHandler {
  /**
   * The event that triggered the context menu
   */
  event: TriggerEvent;

  /**
   * Any props supplied from the trigger or data
   */
  props?: Record<string, unknown>;
}

/**
 * Common style props for components
 */
export interface StyleProps {
  /**
   * Append given css classes
   */
  className?: string;

  /**
   * Append given inline style
   */
  style?: CSSProperties;
}

/**
 * Internal props passed down to menu items
 */
export interface InternalProps {
  /**
   * INTERNAL USE ONLY: `MouseEvent` or `TouchEvent`
   */
  nativeEvent?: TriggerEvent;

  /**
   * INTERNAL USE ONLY: Passed to the Item onClick callback. Accessible via `props`
   */
  propsFromTrigger?: Record<string, unknown>;
}

// ============================================================================
// JSON-driven Menu Types
// ============================================================================
/**
 * Similar to react-intl's FormattedMessage props.
 * Allows for internationalization support without direct dependency.
 */
export interface ContextMenuPredefinedMessage {
  /** Message identifier for i18n lookup */
  id: string;
  /** Fallback message if id is not found */
  defaultMessage?: string;
  /** Values for message interpolation */
  values?: Record<string, string | number>;
}

/**
 * Label can be a plain string or a predefined message for i18n
 */
export type ContextMenuLabel = string | ContextMenuPredefinedMessage;

/**
 * Formatter function signature for internationalization.
 * Users can provide their own formatter (e.g., from react-intl).
 */
export type MessageFormatter = (message: ContextMenuPredefinedMessage) => string;

/**
 * Action handler type for menu items.
 * Receives the original trigger event (right-click/touch event).
 */
export type MenuItemAction = (event: TriggerEvent) => void;

/**
 * Checkbox configuration for menu items
 */
export interface ContextMenuCheckbox {
  /** Whether the checkbox is active/visible */
  active?: boolean;
  /** Whether the checkbox is enabled/clickable */
  enabled: boolean;
  /** Current checked state */
  value: boolean;
}

/**
 * Simple menu item (leaf node)
 */
export interface ContextMenuSimpleItem {
  /** Display text - string or i18n message */
  label: ContextMenuLabel;
  /** Optional icon element */
  icon?: ReactNode;
  /** Tooltip text */
  title?: ContextMenuLabel;
  /** Checkbox configuration */
  checkbox?: ContextMenuCheckbox;
  /** Click action handler */
  action?: MenuItemAction;
  /** Data attribute for testing (Cypress) */
  cyAction?: string;
}

/**
 * Submenu item with nested items
 */
export interface ContextMenuSubMenu {
  /** Display text - string or i18n message */
  label: ContextMenuLabel;
  /** Tooltip text */
  title?: ContextMenuLabel;
  /** Nested menu items */
  items?: ContextMenuItem[];
}

/**
 * Separator item
 */
export interface ContextMenuSeparator {
  /** Must be true to indicate this is a separator */
  separator: true;
}

/**
 * Union type for all menu item types
 */
export type ContextMenuItem = ContextMenuSimpleItem | ContextMenuSeparator | ContextMenuSubMenu;

/**
 * Array of menu items
 */
export type ContextMenuItems = ContextMenuItem[];

/**
 * Menu content configuration
 */
export interface ContextMenuContent {
  items: ContextMenuItems;
}

/**
 * Options for showing a JSON-driven context menu programmatically
 */
export interface ShowJsonContextMenuOptions {
  /** X coordinate (if no event provided) */
  x?: number;
  /** Y coordinate (if no event provided) */
  y?: number;
  /** Trigger event (alternative to x/y) */
  event?: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent;
  /** Menu content configuration */
  contextMenu: ContextMenuContent;
}

/**
 * Props for JsonContextMenu component
 */
export interface JsonContextMenuProps extends StyleProps {
  /** Unique menu identifier */
  id: MenuId;
  /** Theme name (light, dark, or custom) */
  theme?: string;
  /** Animation name (fade, flip, pop, zoom, or custom) */
  animation?: string;
  /** Optional message formatter for i18n support */
  formatMessageProvider?: MessageFormatter;
  /** Invoked when the menu is shown */
  onShow?: () => void;
  /** Invoked when the menu is hidden */
  onHide?: () => void;
  /** Invoked when the menu visibility changes */
  onOpenChange?: (open: boolean) => void;
  /** Invoked when the menu is shown (alias/legacy) */
  onShown?: () => void;
  /** Invoked when the menu is hidden (alias/legacy) */
  onHidden?: () => void;
}

/**
 * Ref handle for JsonContextMenu component
 */
export interface JsonContextMenuRef {
  /** Show the menu with the given options */
  show: (options: ShowJsonContextMenuOptions) => void;
}

// ============================================================================
// Type Guards
// ============================================================================
/**
 * Check if an item is a separator
 */
export function isSeparator(item: ContextMenuItem): item is ContextMenuSeparator {
  return 'separator' in item && item.separator === true;
}

/**
 * Check if an item is a submenu
 */
export function isSubMenu(item: ContextMenuItem): item is ContextMenuSubMenu {
  return 'items' in item && Array.isArray(item.items);
}

/**
 * Check if an item is a simple item
 */
export function isSimpleItem(item: ContextMenuItem): item is ContextMenuSimpleItem {
  return !isSeparator(item) && !isSubMenu(item);
}

/**
 * Check if a label is a predefined message (for i18n)
 */
export function isPredefinedMessage(label: ContextMenuLabel): label is ContextMenuPredefinedMessage {
  return typeof label === 'object' && 'id' in label;
}

/**
 * Resolve a label to a string, using formatter if provided
 */
export function resolveLabel(
  label: ContextMenuLabel | undefined,
  formatMessage?: MessageFormatter
): string {
  if (label === undefined) {
    return '';
  }
  if (typeof label === 'string') {
    return label;
  }
  if (formatMessage) {
    return formatMessage(label);
  }
  return label.defaultMessage ?? label.id;
}
