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

## API

### contextMenu

```typescript
import { contextMenu } from 'replace-react-contexify';

// Show a menu
contextMenu.show({
  id: 'menu-id',
  event: mouseEvent,  // or use x/y coordinates
  x: 100,
  y: 200,
  props: { custom: 'data' }
});

// Hide all menus
contextMenu.hideAll();
```

## Types

All TypeScript types are exported:

```typescript
import type {
  MenuProps,
  ItemProps,
  SubmenuProps,
  MenuItemEventHandler,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPredefinedMessage,
  MessageFormatter,
  JsonContextMenuRef,
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

## License

MIT
