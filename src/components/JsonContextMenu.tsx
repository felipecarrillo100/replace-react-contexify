import {
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Menu } from './Menu';
import { Item } from './Item';
import { Submenu } from './Submenu';
import { Separator } from './Separator';
import { CheckboxIcon, CaretRightIcon } from './icons';
import { contextMenu } from '../utils/contextMenu';
import { theme as defaultTheme, animation as defaultAnimation } from '../utils/styles';
import {
  isSeparator,
  isSubMenu,
  resolveLabel,
  type ContextMenuItem,
  type ContextMenuItems,
  type ContextMenuContent,
  type JsonContextMenuRef,
  type JsonContextMenuProps,
  type ShowJsonContextMenuOptions,
  type ContextMenuSimpleItem,
  type ContextMenuSubMenu,
  type TriggerEvent,
  type MenuItemEventHandler,
} from '../types';

// Re-export props types for convenience
export type { JsonContextMenuProps, ShowJsonContextMenuOptions };

/**
 * JsonContextMenu component renders a context menu from JSON configuration.
 * Supports i18n via optional formatMessage prop.
 *
 * @example
 * ```tsx
 * const menuRef = useRef<JsonContextMenuRef>(null);
 *
 * // Show menu programmatically
 * menuRef.current?.show({
 *   x: 100,
 *   y: 200,
 *   contextMenu: {
 *     items: [
 *       { label: 'Copy', action: handleCopy },
 *       { separator: true },
 *       { label: 'Paste', action: handlePaste },
 *     ]
 *   }
 * });
 *
 * return <JsonContextMenu ref={menuRef} id="json-menu" theme="dark" />;
 * ```
 */
export const JsonContextMenu = forwardRef<JsonContextMenuRef, JsonContextMenuProps>(
  (
    {
      id,
      theme,
      animation,
      className,
      style,
      formatMessageProvider,
      onShow,
      onHide,
      onOpenChange,
      onShown,
      onHidden,
    },
    ref
  ) => {
    const [menuContent, setMenuContent] = useState<ContextMenuContent>({ items: [] });

    // Expose show method via ref
    useImperativeHandle(
      ref,
      () => ({
        show: (options: ShowJsonContextMenuOptions) => {
          // Update state first, then show menu
          setMenuContent(options.contextMenu);

          // Use setTimeout to ensure state update is processed before showing
          setTimeout(() => {
            if (options.event) {
              contextMenu.show({
                id,
                event: options.event,
                props: { contextMenu: options.contextMenu },
              });
            } else if (typeof options.x === 'number' && typeof options.y === 'number') {
              contextMenu.show({
                id,
                x: options.x,
                y: options.y,
                props: { contextMenu: options.contextMenu },
              });
            }
          }, 0);
        },
      }),
      [id]
    );

    // Create action executor - wraps user action to match Item's onClick signature
    const createClickHandler = useCallback(
      (action?: (event: TriggerEvent) => void) => {
        return ({ event }: MenuItemEventHandler) => {
          if (typeof action === 'function') {
            action(event);
          }
        };
      },
      []
    );

    // Render menu items recursively
    const renderItems = useCallback(
      (items: ContextMenuItems): ReactNode[] => {
        return items.map((item: ContextMenuItem, index: number) => {
          // Separator
          if (isSeparator(item)) {
            return <Separator key={index} />;
          }

          // Submenu
          if (isSubMenu(item)) {
            const submenuItem = item as ContextMenuSubMenu;
            const label = resolveLabel(submenuItem.label, formatMessageProvider);
            const subItems = submenuItem.items ? renderItems(submenuItem.items) : null;

            if (!subItems || subItems.length === 0) {
              return null;
            }

            return (
              <Submenu
                key={index}
                label={label}
                arrow={<CaretRightIcon size={12} />}
              >
                {subItems}
              </Submenu>
            );
          }

          // Simple item
          const simpleItem = item as ContextMenuSimpleItem;
          const label = resolveLabel(simpleItem.label, formatMessageProvider);
          const title = resolveLabel(simpleItem.title, formatMessageProvider) || undefined;
          const hasCheckbox = !!simpleItem.checkbox;
          const isEnabled = hasCheckbox ? simpleItem.checkbox!.enabled : true;

          if (hasCheckbox) {
            const checkbox = simpleItem.checkbox!;
            const isActive = checkbox.active !== false;
            const isChecked = checkbox.value && isActive;

            return (
              <Item
                key={index}
                onClick={createClickHandler(simpleItem.action)}
                disabled={!isEnabled}
              >
                <div className="react-contexify__item-row">
                  {simpleItem.icon && (
                    <span className="react-contexify__item-icon" title={title}>
                      {simpleItem.icon}
                    </span>
                  )}
                  <span
                    className="react-contexify__item-label"
                    title={title}
                    data-cy={simpleItem.cyAction}
                  >
                    {label}
                  </span>
                  <span className="react-contexify__item-checkbox">
                    <CheckboxIcon
                      checked={isChecked}
                      disabled={!isEnabled}
                      size={14}
                    />
                  </span>
                </div>
              </Item>
            );
          }

          // Regular item without checkbox
          return (
            <Item
              key={index}
              onClick={createClickHandler(simpleItem.action)}
            >
              <div className="react-contexify__item-row">
                {simpleItem.icon && (
                  <span className="react-contexify__item-icon" title={title}>
                    {simpleItem.icon}
                  </span>
                )}
                <span
                  className="react-contexify__item-label"
                  title={title}
                  data-cy={simpleItem.cyAction}
                >
                  {label}
                </span>
              </div>
            </Item>
          );
        }).filter(Boolean) as ReactNode[];
      },
      [formatMessageProvider, createClickHandler]
    );

    const menuStyle: CSSProperties = {
      ...style,
    };

    return (
      <Menu
        id={id}
        theme={theme ?? defaultTheme.dark}
        animation={animation ?? defaultAnimation.pop}
        className={className}
        style={menuStyle}
        onShow={onShow}
        onHide={onHide}
        onOpenChange={onOpenChange}
        onShown={onShown}
        onHidden={onHidden}
      >
        {menuContent.items.length > 0 ? renderItems(menuContent.items) : <div />}
      </Menu>
    );
  }
);

JsonContextMenu.displayName = 'JsonContextMenu';
