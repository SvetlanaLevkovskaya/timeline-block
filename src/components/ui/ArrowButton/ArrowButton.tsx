import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { ArrowIcon } from '../icons/ArrowIcon';
import styles from './ArrowButton.module.scss';

type ArrowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'desktop' | 'mobile';
  direction?: 'left' | 'right';
  iconSize?: number;
  iconColor?: string;
};

export const ArrowButton = ({
  size = 'desktop',
  direction = 'left',
  iconSize,
  iconColor,
  className,
  ...rest
}: ArrowButtonProps) => {
  const defaultIconSize = size === 'desktop' ? 9 : 6;

  return (
    <button
      className={clsx(styles.arrow, styles[size], className, {
        [styles.right]: direction === 'right',
      })}
      {...rest}
    >
      <ArrowIcon size={iconSize ?? defaultIconSize} color={iconColor} direction={direction} />
    </button>
  );
};
