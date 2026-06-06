import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { Menu } from '../components/Menu';
import { JsonContextMenu } from '../components/JsonContextMenu';
import { contextMenu } from '../utils/contextMenu';
import type { ContextMenuContent } from '../types';

describe('Menu Lifecycle Callbacks', () => {
  it('should trigger onShow, onHide, and onOpenChange on Menu', async () => {
    const onShowMock = vi.fn();
    const onHideMock = vi.fn();
    const onOpenChangeMock = vi.fn();
    const onShownMock = vi.fn();
    const onHiddenMock = vi.fn();

    render(
      <Menu
        id="test-lifecycle-menu"
        onShow={onShowMock}
        onHide={onHideMock}
        onOpenChange={onOpenChangeMock}
        onShown={onShownMock}
        onHidden={onHiddenMock}
      >
        <div>Item 1</div>
      </Menu>
    );

    // Context menu is initially hidden, no callbacks called yet
    expect(onShowMock).not.toHaveBeenCalled();
    expect(onOpenChangeMock).not.toHaveBeenCalled();

    // Trigger showing the menu
    act(() => {
      contextMenu.show({
        id: 'test-lifecycle-menu',
        x: 100,
        y: 100,
      });
    });

    // Wait for the menu to render and verify it is visible
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    // Check that show callbacks were called
    expect(onShowMock).toHaveBeenCalledTimes(1);
    expect(onShownMock).toHaveBeenCalledTimes(1);
    expect(onOpenChangeMock).toHaveBeenCalledWith(true);

    // Hide the menu
    act(() => {
      contextMenu.hideAll();
    });

    // Wait for the menu to disappear
    await waitFor(() => {
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });

    // Check that hide callbacks were called
    expect(onHideMock).toHaveBeenCalledTimes(1);
    expect(onHiddenMock).toHaveBeenCalledTimes(1);
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });
});

describe('JsonContextMenu Ref Lifecycle Callbacks', () => {
  it('should trigger callbacks when JsonContextMenu is shown via ref and hidden', async () => {
    const onShowMock = vi.fn();
    const onHideMock = vi.fn();
    const onOpenChangeMock = vi.fn();

    const menuContent: ContextMenuContent = {
      items: [{ label: 'Ref Item' }],
    };

    // Helper wrapper to get the ref
    let jsonMenuRef: any = null;
    const TestComponent = () => {
      return (
        <JsonContextMenu
          ref={(ref) => { jsonMenuRef = ref; }}
          id="ref-lifecycle-menu"
          onShow={onShowMock}
          onHide={onHideMock}
          onOpenChange={onOpenChangeMock}
        />
      );
    };

    render(<TestComponent />);

    expect(jsonMenuRef).not.toBeNull();

    // Show menu via ref
    act(() => {
      jsonMenuRef.show({
        x: 100,
        y: 100,
        contextMenu: menuContent,
      });
    });

    // Wait for menu item to appear
    await waitFor(() => {
      expect(screen.getByText('Ref Item')).toBeInTheDocument();
    });

    expect(onShowMock).toHaveBeenCalledTimes(1);
    expect(onOpenChangeMock).toHaveBeenCalledWith(true);

    // Hide all
    act(() => {
      contextMenu.hideAll();
    });

    await waitFor(() => {
      expect(screen.queryByText('Ref Item')).not.toBeInTheDocument();
    });

    expect(onHideMock).toHaveBeenCalledTimes(1);
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });
});
