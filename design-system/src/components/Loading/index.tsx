import React, { forwardRef } from 'react';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../polymorphic-component-types';
import { MarginProps } from '../Box';
import Text from '../Text';
import styles from './Loading.module.scss';
import clsx from 'clsx';

export interface Props extends MarginProps {
  fullscreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export type LoadingProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>;

type LoadingComponent = <C extends React.ElementType = 'div'>(
  props: LoadingProps<C>,
) => React.ReactElement<LoadingProps<C>> | null;

const Loading: LoadingComponent = forwardRef(function Loading<C extends React.ElementType = 'div'>(
  { as, fullscreen = false, size = 'md', color = '#2563eb', ...rest }: LoadingProps<C>,
  ref?: PolymorphicRef<C>,
) {
  const asComponent: React.ElementType = as || 'div';

  const className = clsx(
    rest.className,
    styles.loading,
    fullscreen && styles.fullscreen,
    styles[size],
  );

  const spinnerSize = {
    sm: '20px',
    md: '40px',
    lg: '60px',
  }[size];

  return (
    <Text
      as={asComponent}
      className={className}
      ref={ref}
      {...rest}
    >
      <div
        className={styles.spinner}
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderColor: color,
          borderTopColor: 'transparent'
        }}
      />
    </Text>
  );
});

export default Loading as typeof Loading;

