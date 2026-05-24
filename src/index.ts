// Core Components
export { Menu } from './components/Menu';
export type { MenuProps } from './components/Menu';

export { Item } from './components/Item';
export type { ItemProps } from './components/Item';

export { Separator } from './components/Separator';

export { IconFont } from './components/IconFont';
export type { IconFontProps } from './components/IconFont';

export { Submenu } from './components/Submenu';
export type { SubmenuProps } from './components/Submenu';

export { MenuProvider } from './components/MenuProvider';
export type { MenuProviderProps } from './components/MenuProvider';

export { Portal } from './components/Portal';
export type { PortalProps } from './components/Portal';

// JSON-driven Menu
export { JsonContextMenu } from './components/JsonContextMenu';
export type { JsonContextMenuProps, ShowJsonContextMenuOptions } from './components/JsonContextMenu';

// Icons
export {
  SquareIcon,
  CheckSquareIcon,
  CaretRightIcon,
  CheckboxIcon,
} from './components/icons';
export type { IconProps, CheckboxIconProps } from './components/icons';

// Utilities
export { contextMenu } from './utils/contextMenu';
export type { ContextMenuAPI, ShowContextMenuParams } from './utils/contextMenu';

export { eventManager } from './utils/eventManager';

export { theme, animation, styles } from './utils/styles';
export type { BuiltInTheme, BuiltInAnimation } from './utils/styles';

export { cx } from './utils/cx';

// Types
export type {
  TriggerEvent,
  MenuId,
  MenuItemEventHandler,
  StyleProps,
  InternalProps,
  // JSON Menu Types
  ContextMenuPredefinedMessage,
  ContextMenuLabel,
  MessageFormatter,
  MenuItemAction,
  ContextMenuCheckbox,
  ContextMenuSimpleItem,
  ContextMenuSubMenu,
  ContextMenuSeparator,
  ContextMenuItem,
  ContextMenuItems,
  ContextMenuContent,
  JsonContextMenuRef,
} from './types';

// Type Guards
export {
  isSeparator,
  isSubMenu,
  isSimpleItem,
  isPredefinedMessage,
  resolveLabel,
} from './types';
