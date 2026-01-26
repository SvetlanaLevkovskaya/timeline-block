import React from 'react';

type ArrowIconProps = {
  size?: number;
  color?: string;
  direction?: 'left' | 'right';
};

export const ArrowIcon = ({
  size = 9,
  color = 'var(--color-text)',
  direction = 'left',
}: ArrowIconProps) => {
  const transform = direction === 'right' ? 'rotate(180 4.5 7)' : undefined;

  return (
    <svg width={size} height={(size / 9) * 14} viewBox="0 0 9 14" fill="none">
      <path
        d="M7.66418 0.707108L1.41419 6.95711L7.66418 13.2071"
        stroke={color}
        strokeWidth="2"
        transform={transform}
      />
    </svg>
  );
};
