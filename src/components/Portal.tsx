import { useState, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children: ReactNode;
}

/**
 * Portal component that renders children into a separate DOM node.
 * Creates a container div appended to document.body.
 */
export const Portal = ({ children }: PortalProps): React.ReactPortal | null => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const div = document.createElement('div');
    div.className = 'react-contexify-portal';
    document.body.appendChild(div);
    setContainer(div);

    return () => {
      document.body.removeChild(div);
    };
  }, []);

  if (!container) {
    return null;
  }

  return createPortal(children, container);
};
