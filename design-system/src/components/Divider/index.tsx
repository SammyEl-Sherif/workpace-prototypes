import React, { forwardRef } from 'react';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../polymorphic-component-types';
import { MarginProps } from '../Box';
import Text from '../Text';
import styles from './Divider.module.scss';
import clsx from 'clsx';

export interface Props extends MarginProps {
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export type DividerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>;

type DividerComponent = <C extends React.ElementType = 'hr'>(
  props: DividerProps<C>,
) => React.ReactElement<DividerProps<C>> | null;

const Divider: DividerComponent = forwardRef(function Divider<C extends React.ElementType = 'hr'>(
  { as, orientation = 'horizontal', size = 'md', color, ...rest }: DividerProps<C>,
  ref?: PolymorphicRef<C>,
) {
  const asComponent: React.ElementType = as || 'hr';

  const className = clsx(
    rest.className,
    styles.divider,
    styles[orientation],
    styles[size],
  );

  return (
    <Text
      as={asComponent}
      className={className}
      style={{
        ...rest.style,
        ...(color && { borderColor: color })
      }}
      ref={ref}
      {...rest}
    />
  );
});

export default Divider as typeof Divider;

