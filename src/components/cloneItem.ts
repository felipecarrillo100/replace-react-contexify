import { Children, cloneElement, isValidElement, type ReactNode, type ReactElement } from 'react';
import type { TriggerEvent } from '../types';

export interface CloneItemProps {
  nativeEvent: TriggerEvent;
  propsFromTrigger?: Record<string, unknown>;
}

/**
 * Clone menu item children with additional props (event and trigger props).
 * Filters out null/undefined children.
 */
export function cloneItem(
  children: ReactNode,
  props: CloneItemProps
): ReactNode {
  return Children.map(
    // Filter out null/undefined children
    Children.toArray(children).filter(Boolean),
    (child) => {
      if (isValidElement(child)) {
        return cloneElement(child as ReactElement<CloneItemProps>, props);
      }
      return child;
    }
  );
}
