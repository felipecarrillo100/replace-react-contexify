import { describe, it, expect, vi, beforeEach } from 'vitest';
import { contextMenu } from '../utils/contextMenu';
import { eventManager } from '../utils/eventManager';
import { DISPLAY_MENU, HIDE_ALL } from '../utils/actions';

// Mock eventManager
vi.mock('../utils/eventManager', () => ({
  eventManager: {
    emit: vi.fn(),
    on: vi.fn(() => () => {}),
  },
}));

describe('contextMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('show', () => {
    it('should emit DISPLAY_MENU event with native event', () => {
      const mockEvent = new MouseEvent('contextmenu', {
        clientX: 100,
        clientY: 200,
      });

      contextMenu.show({
        id: 'test-menu',
        event: mockEvent,
        props: { data: 'test' },
      });

      expect(eventManager.emit).toHaveBeenCalledWith(
        DISPLAY_MENU('test-menu'),
        mockEvent,
        { data: 'test' }
      );
    });

    it('should emit DISPLAY_MENU event with x/y coordinates', () => {
      contextMenu.show({
        id: 'test-menu',
        x: 150,
        y: 250,
        props: { data: 'test' },
      });

      expect(eventManager.emit).toHaveBeenCalledWith(
        DISPLAY_MENU('test-menu'),
        expect.objectContaining({
          clientX: 150,
          clientY: 250,
          type: 'contextmenu',
        }),
        { data: 'test' }
      );
    });

    it('should handle React synthetic event', () => {
      const nativeEvent = new MouseEvent('contextmenu', {
        clientX: 100,
        clientY: 200,
      });
      const syntheticEvent = { nativeEvent } as unknown as React.MouseEvent;

      contextMenu.show({
        id: 'test-menu',
        event: syntheticEvent,
      });

      expect(eventManager.emit).toHaveBeenCalledWith(
        DISPLAY_MENU('test-menu'),
        nativeEvent,
        {}
      );
    });

    it('should warn if neither event nor coordinates provided', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      contextMenu.show({
        id: 'test-menu',
      });

      expect(warnSpy).toHaveBeenCalledWith(
        'contextMenu.show() requires either an event or x/y coordinates'
      );
      expect(eventManager.emit).not.toHaveBeenCalled();

      warnSpy.mockRestore();
    });

    it('should use empty props object if not provided', () => {
      contextMenu.show({
        id: 'test-menu',
        x: 100,
        y: 100,
      });

      expect(eventManager.emit).toHaveBeenCalledWith(
        DISPLAY_MENU('test-menu'),
        expect.anything(),
        {}
      );
    });
  });

  describe('hideAll', () => {
    it('should emit HIDE_ALL event', () => {
      contextMenu.hideAll();

      expect(eventManager.emit).toHaveBeenCalledWith(HIDE_ALL);
    });
  });
});

