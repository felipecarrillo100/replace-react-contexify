import { useState, useRef, type MouseEvent } from 'react';
import { useIntl } from 'react-intl';
import {
  Menu,
  Item,
  Separator,
  Submenu,
  MenuProvider,
  JsonContextMenu,
  contextMenu,
  type JsonContextMenuRef,
  type MenuItemEventHandler,
  type ContextMenuContent,
  type MessageFormatter,
} from '../src';
import { CodeSnippet } from './CodeSnippet';
import '../scss/main.scss';

interface AppProps {
  supportedLocales: string[];
  currentLocale: string;
  onLocaleChange: (locale: string) => void;
}

// Demo sections
type ThemeOption = 'none' | 'light' | 'dark';
type AnimationOption = 'none' | 'fade' | 'flip' | 'pop' | 'zoom';

const MENU_ID = 'demo-menu';
const JSON_MENU_ID = 'json-demo-menu';

// Code snippets for each section
const CODE_SNIPPETS = {
  basic: `import { Menu, Item, Separator, Submenu, MenuProvider } from 'replace-react-contexify';
import 'replace-react-contexify/styles.css';

function App() {
  const handleClick = ({ props }) => {
    console.log('Clicked:', props.action);
  };

  return (
    <>
      <MenuProvider id="my-menu" data={{ action: 'trigger' }}>
        <div>Right-click me!</div>
      </MenuProvider>

      <Menu id="my-menu" theme="dark" animation="pop">
        <Item onClick={handleClick} data={{ action: 'Copy' }}>📋 Copy</Item>
        <Item onClick={handleClick} data={{ action: 'Cut' }}>✂️ Cut</Item>
        <Separator />
        <Item onClick={handleClick} data={{ action: 'Paste' }}>📥 Paste</Item>
        <Submenu label="📁 More Options">
          <Item onClick={handleClick}>Option A</Item>
          <Item onClick={handleClick}>Option B</Item>
        </Submenu>
      </Menu>
    </>
  );
}`,

  programmatic: `import { Menu, Item, contextMenu } from 'replace-react-contexify';

function App() {
  // Show with event (gets position from event)
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    contextMenu.show({
      id: 'my-menu',
      event: e,
      props: { data: 'from event' }
    });
  };

  // Show at specific coordinates
  const handleShowAtPosition = () => {
    contextMenu.show({
      id: 'my-menu',
      x: 300,
      y: 300,
      props: { data: 'from coordinates' }
    });
  };

  return (
    <>
      <button onContextMenu={handleRightClick}>Right-click me</button>
      <button onClick={handleShowAtPosition}>Show at (300, 300)</button>

      <Menu id="my-menu">
        <Item onClick={({ props }) => console.log(props)}>Action</Item>
      </Menu>
    </>
  );
}`,

  jsonMenu: `import { useRef } from 'react';
import { JsonContextMenu, type JsonContextMenuRef, type ContextMenuContent } from 'replace-react-contexify';

function App() {
  const menuRef = useRef<JsonContextMenuRef>(null);
  const [checked, setChecked] = useState(false);

  const menuContent: ContextMenuContent = {
    items: [
      { label: 'Edit', icon: <span>✏️</span>, action: () => console.log('Edit') },
      { label: 'Copy', icon: <span>📋</span>, action: () => console.log('Copy') },
      { separator: true },
      {
        label: 'Toggle Option',
        checkbox: { enabled: true, value: checked },
        action: () => setChecked(v => !v)
      },
      {
        label: 'Nested Menu',
        items: [
          { label: 'Sub Item 1', action: () => console.log('Sub 1') },
          { label: 'Sub Item 2', action: () => console.log('Sub 2') },
        ]
      }
    ]
  };

  const showMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    menuRef.current?.show({ event: e, contextMenu: menuContent });
  };

  return (
    <>
      <button onContextMenu={showMenu}>Right-click for JSON Menu</button>
      <JsonContextMenu ref={menuRef} id="json-menu" theme="dark" />
    </>
  );
}`,

  i18n: `import { useRef } from 'react';
import { useIntl } from 'react-intl';
import { JsonContextMenu, type JsonContextMenuRef, type MessageFormatter } from 'replace-react-contexify';

function App() {
  const intl = useIntl();
  const menuRef = useRef<JsonContextMenuRef>(null);

  // Use react-intl's formatMessage - supports values interpolation!
  const formatMessage: MessageFormatter = (msg) => {
    return intl.formatMessage({ id: msg.id, defaultMessage: msg.defaultMessage }, msg.values);
  };

  const menuContent = {
    items: [
      { label: { id: 'menu.save', defaultMessage: 'Save' }, action: () => {} },
      { label: { id: 'menu.open', defaultMessage: 'Open' }, action: () => {} },
      { separator: true },
      // Example with values interpolation
      { 
        label: { 
          id: 'menu.deleteCount', 
          defaultMessage: 'Delete {count} items',
          values: { count: 3 }  // Renders: "Delete 3 items"
        }, 
        action: () => {} 
      },
      { 
        label: { 
          id: 'menu.createdBy', 
          defaultMessage: 'Created by {author}',
          values: { author: 'Admin' }  // Renders: "Created by Admin"
        }, 
        action: () => {} 
      },
      { separator: true },
      { label: { id: 'menu.settings', defaultMessage: 'Settings' }, action: () => {} },
    ]
  };

  const showMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    menuRef.current?.show({ event: e, contextMenu: menuContent });
  };

  return (
    <>
      <button onContextMenu={showMenu}>Right-click for i18n Menu</button>
      <JsonContextMenu 
        ref={menuRef} 
        id="i18n-menu" 
        formatMessageProvider={formatMessage} 
      />
    </>
  );
}`,

  disabled: `import { Menu, Item, Separator, MenuProvider } from 'replace-react-contexify';

function App() {
  return (
    <>
      <MenuProvider id="my-menu">
        <div>Right-click me</div>
      </MenuProvider>

      <Menu id="my-menu">
        <Item onClick={() => {}}>✅ Enabled Item</Item>
        
        {/* Static disabled */}
        <Item disabled>🚫 Always Disabled</Item>
        
        {/* Conditionally disabled via function */}
        <Item
          disabled={({ props }) => props?.disabled === true}
          data={{ disabled: true }}
        >
          🔒 Conditionally Disabled
        </Item>
        
        <Separator />
        <Item onClick={() => {}}>✅ Another Enabled</Item>
      </Menu>
    </>
  );
}`,

  submenu: `import { Menu, Item, Submenu, MenuProvider } from 'replace-react-contexify';

function App() {
  return (
    <>
      <MenuProvider id="my-menu">
        <div>Right-click me</div>
      </MenuProvider>

      <Menu id="my-menu" theme="dark">
        <Item onClick={() => {}}>📄 Root Item</Item>
        
        <Submenu label="📁 Folder 1">
          <Item onClick={() => {}}>📄 File 1.1</Item>
          <Item onClick={() => {}}>📄 File 1.2</Item>
          
          {/* Nested submenu */}
          <Submenu label="📁 Subfolder">
            <Item onClick={() => {}}>📄 Deep File A</Item>
            <Item onClick={() => {}}>📄 Deep File B</Item>
          </Submenu>
        </Submenu>
        
        <Submenu label="📁 Folder 2">
          <Item onClick={() => {}}>📄 File 2.1</Item>
        </Submenu>
      </Menu>
    </>
  );
}`,

  styling: `import { Menu, Item, MenuProvider } from 'replace-react-contexify';
import 'replace-react-contexify/styles.css';

function App() {
  return (
    <>
      <MenuProvider id="styled-menu">
        <div>Right-click me</div>
      </MenuProvider>

      <Menu
        id="styled-menu"
        theme="dark"           // Built-in: 'light' | 'dark'
        animation="pop"        // Built-in: 'fade' | 'flip' | 'pop' | 'zoom'
        className="custom-menu"
        style={{ borderRadius: '12px', minWidth: '220px' }}
      >
        <Item style={{ color: '#ff6b6b' }}>🔴 Red Item</Item>
        <Item style={{ color: '#4ecdc4' }}>🟢 Teal Item</Item>
        <Item style={{ color: '#ffe66d' }}>🟡 Yellow Item</Item>
      </Menu>
    </>
  );
}

/* Custom CSS */
.custom-menu {
  background: linear-gradient(135deg, rgba(30, 30, 60, 0.98), rgba(20, 20, 40, 0.98));
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}`,

  rtl: `import { Menu, Item, Submenu, MenuProvider } from 'replace-react-contexify';

function App() {
  return (
    // Wrap with dir="rtl" for RTL support
    <div dir="rtl">
      <MenuProvider id="rtl-menu">
        <div>انقر بالزر الأيمن هنا</div>
      </MenuProvider>

      <Menu id="rtl-menu" theme="dark">
        <Item onClick={() => {}}>📋 نسخ</Item>
        <Item onClick={() => {}}>✂️ قص</Item>
        <Item onClick={() => {}}>📥 لصق</Item>
        <Submenu label="📁 المزيد من الخيارات">
          <Item onClick={() => {}}>الخيار أ</Item>
          <Item onClick={() => {}}>الخيار ب</Item>
        </Submenu>
      </Menu>
    </div>
  );
}

// RTL is automatically detected from:
// - dir="rtl" attribute on any parent element
// - html[dir="rtl"]
// - CSS direction: rtl`,

  rtlJsonMenu: `import { useRef } from 'react';
import { JsonContextMenu, type JsonContextMenuRef, type ContextMenuContent } from 'replace-react-contexify';

function App() {
  const menuRef = useRef<JsonContextMenuRef>(null);

  const rtlMenuContent: ContextMenuContent = {
    items: [
      { label: '📋 نسخ (Copy)', action: () => console.log('Copy') },
      { label: '✂️ قص (Cut)', action: () => console.log('Cut') },
      { label: '📥 لصق (Paste)', action: () => console.log('Paste') },
      { separator: true },
      {
        label: '📁 المزيد (More)',
        items: [
          { label: 'الخيار أ (Option A)', action: () => console.log('A') },
          { label: 'الخيار ب (Option B)', action: () => console.log('B') },
          {
            label: '📁 مجلد فرعي (Subfolder)',
            items: [
              { label: 'ملف عميق أ (Deep A)', action: () => console.log('Deep A') },
              { label: 'ملف عميق ب (Deep B)', action: () => console.log('Deep B') },
            ]
          }
        ]
      }
    ]
  };

  const showMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    menuRef.current?.show({ event: e, contextMenu: rtlMenuContent });
  };

  return (
    // Wrap with dir="rtl" for RTL support
    <div dir="rtl">
      <button onContextMenu={showMenu}>انقر بالزر الأيمن هنا</button>
      <JsonContextMenu ref={menuRef} id="rtl-json-menu" theme="dark" />
    </div>
  );
}

// RTL is automatically detected from the trigger element's computed direction`
};

export default function App({ supportedLocales, currentLocale, onLocaleChange }: AppProps) {
  const intl = useIntl();
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>('dark');
  const [selectedAnimation, setSelectedAnimation] = useState<AnimationOption>('pop');
  const [lastAction, setLastAction] = useState<string>('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const JsonContextMenuRef = useRef<JsonContextMenuRef>(null);

  // Handle menu item click
  const handleItemClick = ({ props }: MenuItemEventHandler) => {
    const action = (props as { action?: string })?.action || 'Unknown action';
    setLastAction(`Clicked: ${action} at ${new Date().toLocaleTimeString()}`);
  };

  // Programmatic menu trigger
  const handleProgrammaticShow = (e: MouseEvent) => {
    e.preventDefault();
    contextMenu.show({
      id: MENU_ID,
      event: e,
      props: { action: 'Programmatic trigger' },
    });
  };

  // Programmatic with coordinates
  const handleCoordinateShow = () => {
    contextMenu.show({
      id: MENU_ID,
      x: 300,
      y: 300,
      props: { action: 'Coordinate trigger (300, 300)' },
    });
  };

  // JSON Menu content
  const jsonMenuContent: ContextMenuContent = {
    items: [
      {
        label: 'Edit',
        icon: <span>✏️</span>,
        action: () => setLastAction('JSON Menu: Edit clicked'),
      },
      {
        label: 'Copy',
        icon: <span>📋</span>,
        action: () => setLastAction('JSON Menu: Copy clicked'),
      },
      { separator: true },
      {
        label: 'Toggle Checkbox',
        checkbox: {
          enabled: true,
          value: checkboxValue,
        },
        action: () => {
          setCheckboxValue((v) => !v);
          setLastAction(`JSON Menu: Checkbox toggled to ${!checkboxValue}`);
        },
      },
      {
        label: 'Disabled Checkbox',
        checkbox: {
          enabled: false,
          value: true,
        },
      },
      { separator: true },
      {
        label: 'Nested Menu',
        items: [
          {
            label: 'Sub Item 1',
            action: () => setLastAction('JSON Menu: Sub Item 1 clicked'),
          },
          {
            label: 'Sub Item 2',
            action: () => setLastAction('JSON Menu: Sub Item 2 clicked'),
          },
          {
            label: 'Deep Nested',
            items: [
              {
                label: 'Deep Item A',
                action: () => setLastAction('JSON Menu: Deep Item A clicked'),
              },
              {
                label: 'Deep Item B',
                action: () => setLastAction('JSON Menu: Deep Item B clicked'),
              },
            ],
          },
        ],
      },
    ],
  };

  // Show JSON menu
  const handleJsonMenuShow = (e: MouseEvent) => {
    e.preventDefault();
    JsonContextMenuRef.current?.show({
      event: e,
      contextMenu: jsonMenuContent,
    });
  };

  // Show JSON menu with coordinates
  const handleJsonMenuCoordShow = () => {
    JsonContextMenuRef.current?.show({
      x: 500,
      y: 300,
      contextMenu: jsonMenuContent,
    });
  };

  // i18n example with react-intl's formatMessage
  const formatMessage: MessageFormatter = (msg) => {
    return intl.formatMessage({ id: msg.id, defaultMessage: msg.defaultMessage }, msg.values);
  };

  const i18nMenuContent: ContextMenuContent = {
    items: [
      { label: { id: 'menu.save', defaultMessage: 'Save' }, action: () => setLastAction('i18n: Save') },
      { label: { id: 'menu.open', defaultMessage: 'Open' }, action: () => setLastAction('i18n: Open') },
      { separator: true },
      { label: { id: 'menu.edit', defaultMessage: 'Edit' }, action: () => setLastAction('i18n: Edit') },
      { label: { id: 'menu.copy', defaultMessage: 'Copy' }, action: () => setLastAction('i18n: Copy') },
      { separator: true },
      // Example with values interpolation
      { 
        label: { 
          id: 'menu.deleteCount', 
          defaultMessage: 'Delete {count} items',
          values: { count: 3 }
        }, 
        action: () => setLastAction('i18n: Delete 3 items') 
      },
      { 
        label: { 
          id: 'menu.createdBy', 
          defaultMessage: 'Created by {author}',
          values: { author: 'Admin' }
        }, 
        action: () => setLastAction('i18n: Created by Admin') 
      },
      { separator: true },
      { label: { id: 'menu.settings', defaultMessage: 'Settings' }, action: () => setLastAction('i18n: Settings') },
    ],
  };

  const i18nMenuRef = useRef<JsonContextMenuRef>(null);
  const rtlJsonMenuRef = useRef<JsonContextMenuRef>(null);

  const handleI18nMenuShow = (e: MouseEvent) => {
    e.preventDefault();
    i18nMenuRef.current?.show({
      event: e,
      contextMenu: i18nMenuContent,
    });
  };

  // RTL JSON Menu content (Arabic)
  const rtlJsonMenuContent: ContextMenuContent = {
    items: [
      {
        label: '📋 نسخ (Copy)',
        action: () => setLastAction('RTL JSON: Copy clicked'),
      },
      {
        label: '✂️ قص (Cut)',
        action: () => setLastAction('RTL JSON: Cut clicked'),
      },
      {
        label: '📥 لصق (Paste)',
        action: () => setLastAction('RTL JSON: Paste clicked'),
      },
      { separator: true },
      {
        label: '📁 المزيد (More)',
        items: [
          {
            label: 'الخيار أ (Option A)',
            action: () => setLastAction('RTL JSON: Option A clicked'),
          },
          {
            label: 'الخيار ب (Option B)',
            action: () => setLastAction('RTL JSON: Option B clicked'),
          },
          {
            label: '📁 مجلد فرعي (Subfolder)',
            items: [
              {
                label: 'ملف عميق أ (Deep A)',
                action: () => setLastAction('RTL JSON: Deep A clicked'),
              },
              {
                label: 'ملف عميق ب (Deep B)',
                action: () => setLastAction('RTL JSON: Deep B clicked'),
              },
            ],
          },
        ],
      },
    ],
  };

  const handleRtlJsonMenuShow = (e: MouseEvent) => {
    e.preventDefault();
    rtlJsonMenuRef.current?.show({
      event: e,
      contextMenu: rtlJsonMenuContent,
    });
  };

  const currentTheme = selectedTheme === 'none' ? undefined : selectedTheme;
  const currentAnimation = selectedAnimation === 'none' ? undefined : selectedAnimation;

  return (
    <div className="demo-app">
      <header className="demo-header">
        <h1>🎯 replace-react-contexify</h1>
        <p>Modern React Context Menu Library • Zero Dependencies • React 16.8 - 19</p>
        <div className="demo-links">
          <a href="https://www.npmjs.com/package/replace-react-contexify" target="_blank" rel="noopener noreferrer">
            📦 NPM
          </a>
          <a href="https://github.com/felipecarrillo100/replace-react-contexify" target="_blank" rel="noopener noreferrer">
            📂 GitHub
          </a>
        </div>
      </header>

      <main className="demo-main">
        {/* Controls */}
        <section className="demo-section">
          <h2>⚙️ Settings</h2>
          <div className="demo-controls">
            <label>
              Theme:
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value as ThemeOption)}
              >
                <option value="none">Default (Light)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label>
              Animation:
              <select
                value={selectedAnimation}
                onChange={(e) => setSelectedAnimation(e.target.value as AnimationOption)}
              >
                <option value="none">None</option>
                <option value="fade">Fade</option>
                <option value="flip">Flip</option>
                <option value="pop">Pop</option>
                <option value="zoom">Zoom</option>
              </select>
            </label>
          </div>
          {lastAction && (
            <div className="demo-last-action">
              <strong>Last Action:</strong> {lastAction}
            </div>
          )}
        </section>

        {/* Basic Usage with MenuProvider */}
        <section className="demo-section">
          <h2>📌 Basic Usage (MenuProvider)</h2>
          <p>Right-click the box below to open the context menu.</p>
          <MenuProvider id={MENU_ID} className="demo-trigger-box" data={{ action: 'MenuProvider trigger' }}>
            <div className="demo-box">
              Right-click me!
            </div>
          </MenuProvider>
          <CodeSnippet code={CODE_SNIPPETS.basic} title="Code" />
        </section>

        {/* Programmatic Trigger */}
        <section className="demo-section">
          <h2>🔧 Programmatic Trigger</h2>
          <p>Click the buttons to show the menu programmatically.</p>
          <div className="demo-buttons">
            <button onClick={handleProgrammaticShow} onContextMenu={handleProgrammaticShow}>
              Click or Right-click (with event)
            </button>
            <button onClick={handleCoordinateShow}>
              Show at (300, 300)
            </button>
          </div>
          <CodeSnippet code={CODE_SNIPPETS.programmatic} title="Code" />
        </section>

        {/* JSON-driven Menu */}
        <section className="demo-section">
          <h2>📝 JSON-driven Menu</h2>
          <p>Menu content defined as JSON configuration with checkboxes and nested items.</p>
          <div className="demo-buttons">
            <button onContextMenu={handleJsonMenuShow} onClick={handleJsonMenuShow}>
              Right-click for JSON Menu
            </button>
            <button onClick={handleJsonMenuCoordShow}>
              Show JSON Menu at (500, 300)
            </button>
          </div>
          <p className="demo-note">
            Checkbox state: <strong>{checkboxValue ? '✅ Checked' : '⬜ Unchecked'}</strong>
          </p>
          <CodeSnippet code={CODE_SNIPPETS.jsonMenu} title="Code" />
        </section>

        {/* i18n Example with react-intl */}
        <section className="demo-section">
          <h2>🌍 i18n Support (react-intl)</h2>
          <p>
            Menu with real <code>react-intl</code> integration. Change locale to see translations.
          </p>
          <div className="demo-controls">
            <label>
              Locale:
              <select
                value={currentLocale}
                onChange={(e) => onLocaleChange(e.target.value)}
              >
                {supportedLocales.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc.toUpperCase()} - {loc === 'en' ? 'English' : loc === 'es' ? 'Español' : 'Deutsch'}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button onContextMenu={handleI18nMenuShow} onClick={handleI18nMenuShow}>
            Right-click for i18n Menu
          </button>
          <CodeSnippet code={CODE_SNIPPETS.i18n} title="Code" />
        </section>

        {/* Disabled Items */}
        <section className="demo-section">
          <h2>🚫 Disabled Items</h2>
          <MenuProvider id="disabled-demo" className="demo-trigger-box">
            <div className="demo-box demo-box-small">
              Right-click me
            </div>
          </MenuProvider>
          <Menu id="disabled-demo" theme={currentTheme} animation={currentAnimation}>
            <Item onClick={handleItemClick} data={{ action: 'Enabled item' }}>
              ✅ Enabled Item
            </Item>
            <Item disabled>
              🚫 Static Disabled
            </Item>
            <Item
              disabled={({ props }: MenuItemEventHandler) => (props as { disabled?: boolean })?.disabled === true}
              data={{ disabled: true, action: 'Conditional disabled' }}
            >
              🔒 Conditionally Disabled (via function)
            </Item>
            <Separator />
            <Item onClick={handleItemClick} data={{ action: 'Another enabled' }}>
              ✅ Another Enabled
            </Item>
          </Menu>
          <CodeSnippet code={CODE_SNIPPETS.disabled} title="Code" />
        </section>

        {/* Nested Submenus */}
        <section className="demo-section">
          <h2>📂 Nested Submenus</h2>
          <MenuProvider id="submenu-demo" className="demo-trigger-box">
            <div className="demo-box demo-box-small">
              Right-click me
            </div>
          </MenuProvider>
          <Menu id="submenu-demo" theme={currentTheme} animation={currentAnimation}>
            <Item onClick={handleItemClick} data={{ action: 'Root item' }}>
              📄 Root Item
            </Item>
            <Submenu label="📁 Folder 1">
              <Item onClick={handleItemClick} data={{ action: 'File 1.1' }}>
                📄 File 1.1
              </Item>
              <Item onClick={handleItemClick} data={{ action: 'File 1.2' }}>
                📄 File 1.2
              </Item>
              <Submenu label="📁 Subfolder">
                <Item onClick={handleItemClick} data={{ action: 'Deep File A' }}>
                  📄 Deep File A
                </Item>
                <Item onClick={handleItemClick} data={{ action: 'Deep File B' }}>
                  📄 Deep File B
                </Item>
              </Submenu>
            </Submenu>
            <Submenu label="📁 Folder 2">
              <Item onClick={handleItemClick} data={{ action: 'File 2.1' }}>
                📄 File 2.1
              </Item>
            </Submenu>
          </Menu>
          <CodeSnippet code={CODE_SNIPPETS.submenu} title="Code" />
        </section>

        {/* Custom Styling */}
        <section className="demo-section">
          <h2>🎨 Custom Styling</h2>
          <MenuProvider id="styled-demo" className="demo-trigger-box">
            <div className="demo-box demo-box-gradient">
              Right-click me
            </div>
          </MenuProvider>
          <Menu
            id="styled-demo"
            theme={currentTheme}
            animation={currentAnimation}
            className="custom-menu"
            style={{ borderRadius: '12px', minWidth: '220px' }}
          >
            <Item onClick={handleItemClick} data={{ action: 'Custom styled' }} style={{ color: '#ff6b6b' }}>
              🔴 Red Item
            </Item>
            <Item onClick={handleItemClick} data={{ action: 'Custom styled' }} style={{ color: '#4ecdc4' }}>
              🟢 Teal Item
            </Item>
            <Item onClick={handleItemClick} data={{ action: 'Custom styled' }} style={{ color: '#ffe66d' }}>
              🟡 Yellow Item
            </Item>
          </Menu>
          <CodeSnippet code={CODE_SNIPPETS.styling} title="Code" />
        </section>

        {/* RTL Support */}
        <section className="demo-section">
          <h2>🔄 RTL (Right-to-Left) Support</h2>
          <p>Full RTL support for Arabic, Hebrew, Persian, and other RTL languages.</p>
          <div dir="rtl" className="demo-rtl-container">
            <MenuProvider id="rtl-demo" className="demo-trigger-box">
              <div className="demo-box demo-box-small" style={{ textAlign: 'right' }}>
                انقر بالزر الأيمن هنا
              </div>
            </MenuProvider>
          </div>
          <Menu id="rtl-demo" theme={currentTheme} animation={currentAnimation}>
            <Item onClick={handleItemClick} data={{ action: 'RTL Copy' }}>
              📋 نسخ (Copy)
            </Item>
            <Item onClick={handleItemClick} data={{ action: 'RTL Cut' }}>
              ✂️ قص (Cut)
            </Item>
            <Item onClick={handleItemClick} data={{ action: 'RTL Paste' }}>
              📥 لصق (Paste)
            </Item>
            <Separator />
            <Submenu label="📁 المزيد (More)">
              <Item onClick={handleItemClick} data={{ action: 'RTL Option A' }}>
                الخيار أ (Option A)
              </Item>
              <Item onClick={handleItemClick} data={{ action: 'RTL Option B' }}>
                الخيار ب (Option B)
              </Item>
              <Submenu label="📁 مجلد فرعي (Subfolder)">
                <Item onClick={handleItemClick} data={{ action: 'RTL Deep A' }}>
                  ملف عميق أ (Deep A)
                </Item>
                <Item onClick={handleItemClick} data={{ action: 'RTL Deep B' }}>
                  ملف عميق ب (Deep B)
                </Item>
              </Submenu>
            </Submenu>
          </Menu>
          <CodeSnippet code={CODE_SNIPPETS.rtl} title="Code" />
        </section>

        {/* RTL JsonContextMenu */}
        <section className="demo-section">
          <h2>🔄 RTL JSON Menu</h2>
          <p>JsonContextMenu with RTL support - fully JSON-driven with nested submenus.</p>
          <div dir="rtl" className="demo-rtl-container">
            <button
              onContextMenu={handleRtlJsonMenuShow}
              onClick={handleRtlJsonMenuShow}
              style={{ textAlign: 'right', direction: 'rtl' }}
            >
              انقر بالزر الأيمن هنا (Right-click here)
            </button>
          </div>
          <CodeSnippet code={CODE_SNIPPETS.rtlJsonMenu} title="Code" />
        </section>
      </main>

      {/* Main Demo Menu */}
      <Menu id={MENU_ID} theme={currentTheme} animation={currentAnimation}>
        <Item onClick={handleItemClick} data={{ action: 'Copy' }}>
          📋 Copy
        </Item>
        <Item onClick={handleItemClick} data={{ action: 'Cut' }}>
          ✂️ Cut
        </Item>
        <Item onClick={handleItemClick} data={{ action: 'Paste' }}>
          📥 Paste
        </Item>
        <Separator />
        <Item onClick={handleItemClick} data={{ action: 'Delete' }}>
          🗑️ Delete
        </Item>
        <Separator />
        <Submenu label="📁 More Options">
          <Item onClick={handleItemClick} data={{ action: 'Option A' }}>
            Option A
          </Item>
          <Item onClick={handleItemClick} data={{ action: 'Option B' }}>
            Option B
          </Item>
          <Item onClick={handleItemClick} data={{ action: 'Option C' }}>
            Option C
          </Item>
        </Submenu>
      </Menu>

      {/* JSON Menu */}
      <JsonContextMenu
        ref={JsonContextMenuRef}
        id={JSON_MENU_ID}
        theme={currentTheme}
        animation={currentAnimation}
      />

      {/* i18n Menu */}
      <JsonContextMenu
        ref={i18nMenuRef}
        id="i18n-menu"
        theme={currentTheme}
        animation={currentAnimation}
        formatMessageProvider={formatMessage}
      />

      {/* RTL JSON Menu */}
      <JsonContextMenu
        ref={rtlJsonMenuRef}
        id="rtl-json-menu"
        theme={currentTheme}
        animation={currentAnimation}
      />

      <footer className="demo-footer">
        <p>
          <strong>replace-react-contexify</strong> v1.0.0 •
          React {/* @ts-ignore */ (window as any).React?.version || '19'} •
          <a href="https://github.com/felipecarrillo100/replace-react-contexify" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          {' • '}
          <a href="https://www.npmjs.com/package/replace-react-contexify" target="_blank" rel="noopener noreferrer">
            NPM
          </a>
        </p>
      </footer>
    </div>
  );
}
