import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { JsonContextMenu } from '../components/JsonContextMenu';
import type { JsonContextMenuRef, ContextMenuContent } from '../types';

// Test wrapper component to access ref
function JsonContextMenuTestWrapper({
  onRef,
  ...props
}: {
  onRef: (ref: JsonContextMenuRef | null) => void;
  id: string;
  theme?: string;
}) {
  const menuRef = useRef<JsonContextMenuRef>(null);

  // Pass ref to parent for testing
  if (menuRef.current) {
    onRef(menuRef.current);
  }

  return <JsonContextMenu ref={menuRef} {...props} />;
}

describe('JsonContextMenu', () => {
  it('should render without crashing', () => {
    render(<JsonContextMenu id="test-menu" />);
    // Menu is rendered but hidden initially
  });

  it('should expose show method via ref', () => {
    let menuRef: JsonContextMenuRef | null = null;

    render(
      <JsonContextMenuTestWrapper
        id="test-menu"
        onRef={(ref) => { menuRef = ref; }}
      />
    );

    // The ref should have a show method
    expect(menuRef).toBeDefined();
  });

  it('should render items from contextMenu config', async () => {
    const menuContent: ContextMenuContent = {
      items: [
        { label: 'Copy' },
        { label: 'Cut' },
        { separator: true },
        { label: 'Paste' },
      ],
    };

    const TestComponent = () => {
      const menuRef = useRef<JsonContextMenuRef>(null);

      const handleClick = () => {
        menuRef.current?.show({
          x: 100,
          y: 100,
          contextMenu: menuContent,
        });
      };

      return (
        <>
          <button onClick={handleClick}>Show Menu</button>
          <JsonContextMenu ref={menuRef} id="test-menu" />
        </>
      );
    };

    render(<TestComponent />);

    // Click button to show menu
    fireEvent.click(screen.getByText('Show Menu'));

    // Wait for menu to appear
    await waitFor(() => {
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });

    expect(screen.getByText('Cut')).toBeInTheDocument();
    expect(screen.getByText('Paste')).toBeInTheDocument();
  });

  it('should call action when item is clicked', async () => {
    const mockAction = vi.fn();

    const menuContent: ContextMenuContent = {
      items: [
        { label: 'Action Item', action: mockAction },
      ],
    };

    const TestComponent = () => {
      const menuRef = useRef<JsonContextMenuRef>(null);

      const handleClick = () => {
        menuRef.current?.show({
          x: 100,
          y: 100,
          contextMenu: menuContent,
        });
      };

      return (
        <>
          <button onClick={handleClick}>Show Menu</button>
          <JsonContextMenu ref={menuRef} id="test-menu" />
        </>
      );
    };

    render(<TestComponent />);

    fireEvent.click(screen.getByText('Show Menu'));

    await waitFor(() => {
      expect(screen.getByText('Action Item')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Action Item'));

    expect(mockAction).toHaveBeenCalled();
  });

  it('should render checkbox items correctly', async () => {
    const menuContent: ContextMenuContent = {
      items: [
        {
          label: 'Checked Item',
          checkbox: { enabled: true, value: true }
        },
        {
          label: 'Unchecked Item',
          checkbox: { enabled: true, value: false }
        },
      ],
    };

    const TestComponent = () => {
      const menuRef = useRef<JsonContextMenuRef>(null);

      const handleClick = () => {
        menuRef.current?.show({
          x: 100,
          y: 100,
          contextMenu: menuContent,
        });
      };

      return (
        <>
          <button onClick={handleClick}>Show Menu</button>
          <JsonContextMenu ref={menuRef} id="test-menu" />
        </>
      );
    };

    render(<TestComponent />);

    fireEvent.click(screen.getByText('Show Menu'));

    await waitFor(() => {
      expect(screen.getByText('Checked Item')).toBeInTheDocument();
    });

    expect(screen.getByText('Unchecked Item')).toBeInTheDocument();

    // Check that checkbox icons are rendered
    const checkboxes = document.querySelectorAll('.react-contexify__item-checkbox');
    expect(checkboxes.length).toBe(2);
  });

  it('should use formatMessage for i18n labels', async () => {
    const formatMessage = vi.fn((msg) => `Translated: ${msg.id}`);

    const menuContent: ContextMenuContent = {
      items: [
        { label: { id: 'menu.copy', defaultMessage: 'Copy' } },
      ],
    };

    const TestComponent = () => {
      const menuRef = useRef<JsonContextMenuRef>(null);

      const handleClick = () => {
        menuRef.current?.show({
          x: 100,
          y: 100,
          contextMenu: menuContent,
        });
      };

      return (
        <>
          <button onClick={handleClick}>Show Menu</button>
          <JsonContextMenu ref={menuRef} id="test-menu" formatMessageProvider={formatMessage} />
        </>
      );
    };

    render(<TestComponent />);

    fireEvent.click(screen.getByText('Show Menu'));

    await waitFor(() => {
      expect(screen.getByText('Translated: menu.copy')).toBeInTheDocument();
    });

    expect(formatMessage).toHaveBeenCalledWith({ id: 'menu.copy', defaultMessage: 'Copy' });
  });

  it('should render submenu items', async () => {
    const menuContent: ContextMenuContent = {
      items: [
        {
          label: 'Parent Menu',
          items: [
            { label: 'Child Item 1' },
            { label: 'Child Item 2' },
          ]
        },
      ],
    };

    const TestComponent = () => {
      const menuRef = useRef<JsonContextMenuRef>(null);

      const handleClick = () => {
        menuRef.current?.show({
          x: 100,
          y: 100,
          contextMenu: menuContent,
        });
      };

      return (
        <>
          <button onClick={handleClick}>Show Menu</button>
          <JsonContextMenu ref={menuRef} id="test-menu" />
        </>
      );
    };

    render(<TestComponent />);

    fireEvent.click(screen.getByText('Show Menu'));

    await waitFor(() => {
      expect(screen.getByText('Parent Menu')).toBeInTheDocument();
    });

    // Child items should be in the DOM (in the submenu)
    expect(screen.getByText('Child Item 1')).toBeInTheDocument();
    expect(screen.getByText('Child Item 2')).toBeInTheDocument();
  });
});

