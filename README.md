# replace-react-contexify

Modern React Context Menu Library - **Zero Dependencies** - React 16.8 to 19

[![npm version](https://img.shields.io/npm/v/replace-react-contexify.svg)](https://www.npmjs.com/package/replace-react-contexify)
[![license](https://img.shields.io/github/license/felipecarrillo100/replace-react-contexify.svg)](https://github.com/felipecarrillo100/replace-react-contexify/blob/main/LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/felipecarrillo100/replace-react-contexify)

🔗 **[Live Demo](https://felipecarrillo100.github.io/replace-react-contexify/)** | 📦 **[NPM Package](https://www.npmjs.com/package/replace-react-contexify)** | 📂 **[GitHub Repository](https://github.com/felipecarrillo100/replace-react-contexify)**

## Features

- 🚀 **Modern React** - Functional components with hooks
- 📦 **Zero Dependencies** - Only React as peer dependency
- 🎨 **Themeable** - Built-in light & dark themes, or create your own
- ✨ **Animated** - Fade, flip, pop, zoom animations
- 📱 **Touch Support** - Works with mouse and touch events
- 🔧 **Flexible** - Declarative or programmatic API
- 📝 **JSON-driven** - Build menus from JSON configuration
- 🌍 **i18n Ready** - Optional message formatter for internationalization
- 🔄 **RTL Support** - Full Right-to-Left language support
- 💪 **TypeScript** - Full type definitions included

## Installation

```bash
npm install replace-react-contexify
# or
yarn add replace-react-contexify
# or
pnpm add replace-react-contexify
```

**Note:** Don't forget to import the styles:

```tsx
import 'replace-react-contexify/styles.css';
```

## Quick Start

### Basic Usage (Declarative)

```tsx
import { Menu, Item, Separator, Submenu, MenuProvider } from 'replace-react-contexify';
import 'replace-react-contexify/styles.css';

const handleClick = ({ event, props }) => console.log(event, props);

// Define your menu
const MyMenu = () => (
  <Menu id="menu-id" theme="dark" animation="pop">
    <Item onClick={handleClick}>Copy</Item>
    <Item onClick={handleClick}>Cut</Item>
    <Separator />
    <Item disabled>Paste (disabled)</Item>
    <Submenu label="More Options">
      <Item onClick={handleClick}>Option A</Item>
      <Item onClick={handleClick}>Option B</Item>
    </Submenu>
  </Menu>
);

// Wrap your trigger element
const App = () => (
  <div>
    <MenuProvider id="menu-id">
      <div>Right-click me!</div>
    </MenuProvider>
    <MyMenu />
  </div>
);
```

### Programmatic API

```tsx
import { Menu, Item, contextMenu } from 'replace-react-contexify';
import 'replace-react-contexify/styles.css';

const App = () => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    contextMenu.show({
      id: 'my-menu',
      event: e,
      props: { data: 'custom data' }
    });
  };

  // Or show at specific coordinates
  const showAtPosition = () => {
    contextMenu.show({
      id: 'my-menu',
      x: 200,
      y: 300,
      props: { data: 'coordinate trigger' }
    });
  };

  return (
    <div>
      <button onContextMenu={handleContextMenu}>Right-click me</button>
      <button onClick={showAtPosition}>Show menu at (200, 300)</button>
      <Menu id="my-menu" theme="light">
        <Item onClick={({ props }) => console.log(props)}>Action</Item>
      </Menu>
    </div>
  );
};
```

### JSON-driven Menu

```tsx
import { JsonContextMenu, type JsonContextMenuRef, type ContextMenuContent } from 'replace-react-contexify';
import 'replace-react-contexify/styles.css';

const App = () => {
  const menuRef = useRef<JsonContextMenuRef>(null);

  const menuContent: ContextMenuContent = {
    items: [
      { label: 'Edit', action: () => console.log('Edit') },
      { label: 'Copy', icon: <span>📋</span>, action: () => console.log('Copy') },
      { separator: true },
      { 
        label: 'Enable Feature',
        checkbox: { enabled: true, value: false },
        action: () => console.log('Toggle')
      },
      {
        label: 'More',
        items: [
          { label: 'Sub Item 1', action: () => console.log('Sub 1') },
          { label: 'Sub Item 2', action: () => console.log('Sub 2') },
        ]
      }
    ]
  };

  const showMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    menuRef.current?.show({
      event: e,
      contextMenu: menuContent
    });
  };

  return (
    <div>
      <button onContextMenu={showMenu}>Right-click for JSON Menu</button>
      <JsonContextMenu ref={menuRef} id="json-menu" theme="dark" />
    </div>
  );
};
```

### i18n Support

```tsx
import { JsonContextMenu, type MessageFormatter, type ContextMenuPredefinedMessage } from 'replace-react-contexify';

// Your i18n formatter (e.g., from react-intl)
const formatMessage: MessageFormatter = (msg: ContextMenuPredefinedMessage) => {
  const translations: Record<string, string> = {
    'menu.edit': 'Edit',
    'menu.copy': 'Copy',
    'menu.deleteCount': 'Delete {count} items',
    'menu.createdBy': 'Created by {author}',
  };
  
  let text = translations[msg.id] || msg.defaultMessage || msg.id;
  
  // Replace {key} placeholders with values
  if (msg.values) {
    Object.entries(msg.values).forEach(([key, value]) => {
      text = text.replace(`{${key}}`, String(value));
    });
  }
  
  return text;
};

const menuContent = {
  items: [
    { label: { id: 'menu.edit', defaultMessage: 'Edit' }, action: () => {} },
    { label: { id: 'menu.copy', defaultMessage: 'Copy' }, action: () => {} },
    { separator: true },
    // Using values for interpolation
    { 
      label: { 
        id: 'menu.deleteCount', 
        defaultMessage: 'Delete {count} items',
        values: { count: 5 }  // Will render: "Delete 5 items"
      },
      action: () => {}
    },
    { 
      label: { 
        id: 'menu.createdBy', 
        defaultMessage: 'Created by {author}',
        values: { author: 'John' }  // Will render: "Created by John"
      },
      action: () => {}
    },
  ]
};

<JsonContextMenu 
  ref={menuRef} 
  id="i18n-menu" 
  formatMessageProvider={formatMessage}
/>
```

**With react-intl:**

```tsx
import { useIntl } from 'react-intl';
import { JsonContextMenu, type MessageFormatter } from 'replace-react-contexify';

const App = () => {
  const intl = useIntl();
  
  // react-intl's formatMessage works directly!
  const formatMessage: MessageFormatter = (msg) => {
    return intl.formatMessage(
      { id: msg.id, defaultMessage: msg.defaultMessage },
      msg.values
    );
  };

  return <JsonContextMenu ref={menuRef} id="menu" formatMessageProvider={formatMessage} />;
};
```

### RTL (Right-to-Left) Support

Full support for RTL languages like Arabic, Hebrew, Persian, etc.

```tsx
// Just wrap with dir="rtl" - everything works automatically!
<div dir="rtl">
  <MenuProvider id="rtl-menu">
    <div>انقر بالزر الأيمن هنا</div>
  </MenuProvider>

  <Menu id="rtl-menu" theme="dark">
    <Item onClick={handleClick}>📋 نسخ (Copy)</Item>
    <Item onClick={handleClick}>✂️ قص (Cut)</Item>
    <Submenu label="📁 المزيد (More)">
      <Item onClick={handleClick}>الخيار أ</Item>
      <Item onClick={handleClick}>الخيار ب</Item>
    </Submenu>
  </Menu>
</div>
```

RTL support features:
- ✅ Text alignment automatically flips to right
- ✅ Submenu arrows point left instead of right
- ✅ Submenus open to the left
- ✅ Icon positions flip appropriately
- ✅ Detected from `dir="rtl"` on any parent element or `html[dir="rtl"]`

## Lifecycle Callbacks

Both `<Menu>` and `<JsonContextMenu>` support lifecycle callbacks to track when the menu is opened or closed. This is highly useful for coordinating focus management, tooltips, dropdowns, and other UI layers.

### Callbacks
- **`onShow?: () => void`**: Triggered immediately when the menu opens/fades in.
- **`onHide?: () => void`**: Triggered immediately when the menu closes/fades out.
- **`onOpenChange?: (open: boolean) => void`**: A unified callback that receives the current visibility state (`true` for open, `false` for closed).
- **`onShown` / `onHidden`**: Legacy callback aliases retained for backwards compatibility.

### Coordination Example

A common use case is closing hover tooltips or other overlays when a context menu opens:

```tsx
import { useState } from 'react';
import { JsonContextMenu } from 'replace-react-contexify';

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="dashboard">
      {/* Only show tooltip when the context menu is closed */}
      {!isMenuOpen && <CustomTooltip text="Right-click for options" />}
      
      <JsonContextMenu
        id="dashboard-menu"
        onOpenChange={setIsMenuOpen}
        /* Or use separate callbacks: */
        // onShow={() => setIsMenuOpen(true)}
        // onHide={() => setIsMenuOpen(false)}
      />
    </div>
  );
};
```

## Styling

### Using Compiled CSS (Recommended)

Import the pre-compiled CSS file:

```tsx
import 'replace-react-contexify/styles.css';
```

### Using SCSS (for customization)

For full control over styling, import the SCSS source files:

```scss
// Import all styles
@use 'replace-react-contexify/scss/main';

// Or import individual modules
@use 'replace-react-contexify/scss/menu';
@use 'replace-react-contexify/scss/rtl';
@use 'replace-react-contexify/scss/json-menu';
@use 'replace-react-contexify/scss/themes/dark';
@use 'replace-react-contexify/scss/themes/light';
@use 'replace-react-contexify/scss/animations/fade';
@use 'replace-react-contexify/scss/animations/pop';
```

#### Available SCSS Files

```
replace-react-contexify/scss/
├── main.scss           # All styles bundled
├── _menu.scss          # Core menu styles
├── _rtl.scss           # RTL support
├── _json-menu.scss     # JSON menu specifics
├── animations/
│   ├── _fade.scss
│   ├── _flip.scss
│   ├── _pop.scss
│   └── _zoom.scss
└── themes/
    ├── _dark.scss
    └── _light.scss
```

### Themes

Built-in themes: `light`, `dark`

```tsx
<Menu id="my-menu" theme="dark">
  ...
</Menu>
```

### Animations

Built-in animations: `fade`, `flip`, `pop`, `zoom`

```tsx
<Menu id="my-menu" animation="pop">
  ...
</Menu>
```

## Components

| Component | Description |
|-----------|-------------|
| `Menu` | Container for menu items, positioned at trigger location |
| `Item` | Individual menu item with click handler |
| `Separator` | Visual divider between menu items |
| `Submenu` | Nested menu with child items |
| `MenuProvider` | Wrapper that binds context menu events to children |
| `JsonContextMenu` | Menu rendered from JSON configuration |
| `IconFont` | Helper for displaying icons |

## API Reference

### Menu

The main container component for context menu items.

```tsx
<Menu
  id="my-menu"              // Required: unique identifier
  theme="dark"              // Optional: 'light' | 'dark' | custom string
  animation="pop"           // Optional: 'fade' | 'flip' | 'pop' | 'zoom'
  className="custom-class"  // Optional: additional CSS classes
  style={{ minWidth: 200 }} // Optional: inline styles
>
  {children}
</Menu>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string \| number` | ✅ | Unique identifier to trigger this menu |
| `theme` | `string` | | Built-in: `'light'`, `'dark'` or custom |
| `animation` | `string` | | Built-in: `'fade'`, `'flip'`, `'pop'`, `'zoom'` |
| `className` | `string` | | Additional CSS classes |
| `style` | `CSSProperties` | | Inline styles |
| `onShow` | `() => void` | | Triggered immediately when the menu begins to open/fade in |
| `onHide` | `() => void` | | Triggered immediately when the menu begins to close/fade out |
| `onOpenChange` | `(open: boolean) => void` | | Unified callback triggered when the visibility state changes |
| `onShown` | `() => void` | | Legacy alias for `onShow` (triggered after position calculation) |
| `onHidden` | `() => void` | | Legacy alias for `onHide` (triggered after cleanup) |

---

### Item

Individual clickable menu item.

```tsx
<Item
  onClick={handler}         // Click handler
  disabled={false}          // Static disabled state
  disabled={(args) => bool} // Dynamic disabled state
  data={{ key: 'value' }}   // Custom data passed to onClick
  className="custom"        // Additional CSS classes
  style={{}}                // Inline styles
>
  📋 Copy
</Item>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onClick` | `(args: MenuItemEventHandler) => void` | | Click handler |
| `disabled` | `boolean \| ((args: MenuItemEventHandler) => boolean)` | | Disable the item |
| `data` | `Record<string, unknown>` | | Custom data passed to handlers via `props` |
| `children` | `ReactNode` | ✅ | Item content |
| `className` | `string` | | Additional CSS classes |
| `style` | `CSSProperties` | | Inline styles |

**MenuItemEventHandler:**
```typescript
interface MenuItemEventHandler {
  event: TriggerEvent;                // The original trigger event
  props?: Record<string, unknown>;    // Combined data from trigger + item
}
```

---

### Submenu

Nested menu with child items. Supports infinite nesting.

```tsx
<Submenu
  label="📁 More Options"   // Required: submenu label
  arrow="▶"                 // Optional: custom arrow character
  disabled={false}          // Optional: disable submenu
>
  <Item onClick={handler}>Sub Item 1</Item>
  <Item onClick={handler}>Sub Item 2</Item>
</Submenu>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `ReactNode` | ✅ | Submenu label content |
| `arrow` | `ReactNode` | | Custom arrow (default: `▶`, RTL: `◀`) |
| `disabled` | `boolean \| ((args) => boolean)` | | Disable the submenu |
| `children` | `ReactNode` | ✅ | Submenu items |
| `className` | `string` | | Additional CSS classes |
| `style` | `CSSProperties` | | Inline styles |

---

### Separator

Visual divider between menu items.

```tsx
<Separator />
```

---

### MenuProvider

Wrapper that binds context menu events to children. Right-click triggers the menu.

```tsx
<MenuProvider
  id="my-menu"              // Required: menu id to trigger
  data={{ context: 'data' }} // Optional: data passed to menu items
  className="trigger-area"  // Optional: CSS classes
>
  <div>Right-click me!</div>
</MenuProvider>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string \| number` | ✅ | Menu ID to trigger |
| `data` | `Record<string, unknown>` | | Data passed to item handlers via `props` |
| `children` | `ReactNode` | ✅ | Trigger element(s) |
| `className` | `string` | | Additional CSS classes |
| `style` | `CSSProperties` | | Inline styles |

---

### contextMenu

Programmatic API for showing/hiding menus.

```typescript
import { contextMenu } from 'replace-react-contexify';

// Show menu at event position
contextMenu.show({
  id: 'my-menu',
  event: mouseEvent,
  props: { custom: 'data' }
});

// Show menu at specific coordinates
contextMenu.show({
  id: 'my-menu',
  x: 300,
  y: 200,
  props: { custom: 'data' }
});

// Hide all menus
contextMenu.hideAll();
```

| Method | Parameters | Description |
|--------|------------|-------------|
| `show(options)` | `ShowContextMenuParams` | Display a menu |
| `hideAll()` | none | Hide all visible menus |

**ShowContextMenuParams:**
```typescript
interface ShowContextMenuParams {
  id: MenuId;                          // Menu ID to show
  event?: MouseEvent | TouchEvent;     // Position from event
  x?: number;                          // X coordinate (if no event)
  y?: number;                          // Y coordinate (if no event)
  props?: Record<string, unknown>;     // Data passed to items
}
```

---

### JsonContextMenu

Dynamic menu rendered from JSON configuration. Perfect for API-driven menus.

```tsx
const menuRef = useRef<JsonContextMenuRef>(null);

<JsonContextMenu
  ref={menuRef}                        // Required: ref for imperative control
  id="json-menu"                       // Required: unique identifier
  theme="dark"                         // Optional: theme
  animation="pop"                      // Optional: animation
  formatMessageProvider={formatMessage} // Optional: i18n formatter
/>

// Show the menu
menuRef.current?.show({
  event: mouseEvent,                   // or x/y coordinates
  contextMenu: menuContent             // ContextMenuContent object
});
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `ref` | `Ref<JsonContextMenuRef>` | ✅ | Ref for imperative `show()` method |
| `id` | `string \| number` | ✅ | Unique identifier |
| `theme` | `string` | | Theme name |
| `animation` | `string` | | Animation name |
| `formatMessageProvider` | `MessageFormatter` | | i18n formatter function |
| `onShow` | `() => void` | | Triggered immediately when the menu begins to open |
| `onHide` | `() => void` | | Triggered immediately when the menu begins to close |
| `onOpenChange` | `(open: boolean) => void` | | Unified callback triggered when the visibility state changes |
| `onShown` | `() => void` | | Legacy alias for `onShow` |
| `onHidden` | `() => void` | | Legacy alias for `onHide` |

**JsonContextMenuRef:**
```typescript
interface JsonContextMenuRef {
  show: (options: ShowJsonContextMenuOptions) => void;
}

interface ShowJsonContextMenuOptions {
  x?: number;                          // X coordinate
  y?: number;                          // Y coordinate
  event?: MouseEvent | TouchEvent;     // Or position from event
  contextMenu: ContextMenuContent;     // Menu content
}
```

---

### ContextMenuContent

JSON structure for defining menu content.

```typescript
interface ContextMenuContent {
  items: ContextMenuItem[];
}

// Item types:
type ContextMenuItem = 
  | ContextMenuSimpleItem    // Regular item
  | ContextMenuSeparator     // Separator
  | ContextMenuSubMenu;      // Submenu with nested items
```

**Simple Item:**
```typescript
interface ContextMenuSimpleItem {
  label: string | ContextMenuPredefinedMessage;  // Display text or i18n
  icon?: ReactNode;                              // Optional icon
  title?: string | ContextMenuPredefinedMessage; // Tooltip
  checkbox?: {
    enabled: boolean;                            // Clickable?
    value: boolean;                              // Checked state
  };
  action?: (event: TriggerEvent) => void;        // Click handler
}
```

**Separator:**
```typescript
interface ContextMenuSeparator {
  separator: true;
}
```

**Submenu:**
```typescript
interface ContextMenuSubMenu {
  label: string | ContextMenuPredefinedMessage;
  title?: string | ContextMenuPredefinedMessage;
  items: ContextMenuItem[];                      // Nested items
}
```

---

### i18n / MessageFormatter

For internationalization support, provide a `formatMessageProvider` function.

```typescript
type MessageFormatter = (message: ContextMenuPredefinedMessage) => string;

interface ContextMenuPredefinedMessage {
  id: string;                                    // Message ID for lookup
  defaultMessage?: string;                       // Fallback text
  values?: Record<string, string | number>;      // Interpolation values
}
```

**With react-intl:**
```tsx
import { useIntl } from 'react-intl';

const intl = useIntl();

const formatMessage: MessageFormatter = (msg) => {
  return intl.formatMessage(
    { id: msg.id, defaultMessage: msg.defaultMessage },
    msg.values  // Supports {count}, {name}, etc.
  );
};

<JsonContextMenu
  ref={menuRef}
  id="i18n-menu"
  formatMessageProvider={formatMessage}
/>
```

---

### Type Guards

Utility functions for working with menu items:

```typescript
import { 
  isSeparator, 
  isSubMenu, 
  isSimpleItem, 
  isPredefinedMessage,
  resolveLabel 
} from 'replace-react-contexify';

// Check item types
isSeparator(item)        // item is ContextMenuSeparator
isSubMenu(item)          // item is ContextMenuSubMenu  
isSimpleItem(item)       // item is ContextMenuSimpleItem
isPredefinedMessage(label) // label is ContextMenuPredefinedMessage

// Resolve label to string
resolveLabel(label, formatMessage?)  // Returns string
```

## Types

All TypeScript types are exported:

```typescript
import type {
  // Component Props
  MenuProps,
  ItemProps,
  SubmenuProps,
  SeparatorProps,
  MenuProviderProps,
  JsonContextMenuProps,
  
  // Event & Handler Types
  TriggerEvent,
  MenuId,
  MenuItemEventHandler,
  
  // JSON Menu Types
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSimpleItem,
  ContextMenuSubMenu,
  ContextMenuSeparator,
  ContextMenuCheckbox,
  ContextMenuLabel,
  
  // i18n Types
  ContextMenuPredefinedMessage,
  MessageFormatter,
  
  // Ref Types
  JsonContextMenuRef,
  ShowJsonContextMenuOptions,
} from 'replace-react-contexify';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## React Compatibility

- React 16.8+ (hooks support required)
- React 17
- React 18
- React 19

## Development

```bash
# Install dependencies
npm install

# Run demo
npm run dev

# Run tests
npm test

# Build library
npm run build
```

## Acknowledgments

This project was inspired by and built upon the foundation of [react-contexify](https://github.com/fkhadra/react-contexify) by **Fadi Khadra**. Thank you for creating such a great library that served the React community for years! 🙏

## License

MIT
