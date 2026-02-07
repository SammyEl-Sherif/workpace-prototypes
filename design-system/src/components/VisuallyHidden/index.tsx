import React, { forwardRef } from 'react';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../polymorphic-component-types';
import clsx from 'clsx';
import styles from './VisuallyHidden.module.scss';
import Box from '../Box';

interface Props {
  children?: React.ReactNode;
}

type VisuallyHiddenProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>;

type VisuallyHiddenComponent = <C extends React.ElementType = 'span'>(
  props: VisuallyHiddenProps<C>,
) => React.ReactNode;

// @ts-expect-error - Generic forwardRef is not directly supported in TypeScript
const VisuallyHidden = forwardRef(function VisuallyHidden<
  C extends React.ElementType = 'span',
>({ as, children, ...rest }: VisuallyHiddenProps<C>, ref?: PolymorphicRef<C>) {
  const asComponent: React.ElementType = as || 'span';
  const className = clsx(rest.className, styles['visually-hidden']);

  return (
    <Box as={asComponent} {...rest} className={className} ref={ref}>
      {children}
    </Box>
  );
});

export default VisuallyHidden as VisuallyHiddenComponent;
