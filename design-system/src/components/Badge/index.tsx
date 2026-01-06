import React, { forwardRef } from 'react';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../polymorphic-component-types';
import { MarginProps } from '../Box';
import Text from '../Text';
import styles from './Badge.module.scss';
import clsx from 'clsx';

type Variant = 'default' | 'outline' | 'success' | 'warning' | 'info' | 'error';
type Size = 'sm' | 'md' | 'lg';

export interface Props extends MarginProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
}

export type BadgeProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>;

type BadgeComponent = <C extends React.ElementType = 'span'>(
  props: BadgeProps<C>,
) => React.ReactElement<BadgeProps<C>> | null;

const Badge: BadgeComponent = forwardRef(function Badge<C extends React.ElementType = 'span'>(
  { as, children, variant = 'default', size = 'md', ...rest }: BadgeProps<C>,
  ref?: PolymorphicRef<C>,
) {
  const asComponent: React.ElementType = as || 'span';

  const className = clsx(
    rest.className,
    styles.badge,
    styles[variant],
    styles[size],
  );

  return (
    <Text
      as={asComponent}
      className={className}
      ref={ref}
      {...rest}
    >
      {children}
    </Text>
  );
});

export default Badge as typeof Badge;

