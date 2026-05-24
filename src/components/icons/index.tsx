import type { CSSProperties, FC } from 'react';

export interface IconProps {
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Icon size in pixels (default: 16) */
  size?: number;
  /** Accessible title for screen readers */
  title?: string;
}

/**
 * Empty square icon (unchecked checkbox)
 */
export const SquareIcon: FC<IconProps> = ({
  className,
  style,
  size = 16,
  title = 'Unchecked',
}) => (
  <svg
    className={className}
    style={style}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={!title}
    role={title ? 'img' : undefined}
  >
    {title && <title>{title}</title>}
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  </svg>
);

/**
 * Square with checkmark icon (checked checkbox)
 */
export const CheckSquareIcon: FC<IconProps> = ({
  className,
  style,
  size = 16,
  title = 'Checked',
}) => (
  <svg
    className={className}
    style={style}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={!title}
    role={title ? 'img' : undefined}
  >
    {title && <title>{title}</title>}
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <polyline points="9 11 12 14 22 4" />
  </svg>
);

/**
 * Caret right icon (submenu arrow)
 */
export const CaretRightIcon: FC<IconProps> = ({
  className,
  style,
  size = 12,
  title = 'Submenu',
}) => (
  <svg
    className={className}
    style={style}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden={!title}
    role={title ? 'img' : undefined}
  >
    {title && <title>{title}</title>}
    <path d="M8 5l7 7-7 7z" />
  </svg>
);

/**
 * Checkbox icon that displays either checked or unchecked state
 */
export interface CheckboxIconProps extends IconProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
}

export const CheckboxIcon: FC<CheckboxIconProps> = ({
  checked,
  disabled,
  className,
  style,
  size = 16,
}) => {
  const Icon = checked ? CheckSquareIcon : SquareIcon;
  const computedStyle: CSSProperties = {
    ...style,
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <Icon
      className={className}
      style={computedStyle}
      size={size}
      title={checked ? 'Checked' : 'Unchecked'}
    />
  );
};

