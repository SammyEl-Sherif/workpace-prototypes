import React, { forwardRef } from 'react';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../polymorphic-component-types';
import { MarginProps } from '../Box';
import Text from '../Text';
import clsx from 'clsx';
import styles from './FieldError.module.scss';
import VisuallyHidden from '../VisuallyHidden';
import IconCritical from '../Icons/_icons/IconCritical';

export interface Props extends MarginProps {
  children?: React.ReactNode;
}

export type FieldErrorProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  Props
>;

type FieldErrorComponent = <C extends React.ElementType = 'div'>(
  props: FieldErrorProps<C>,
) => React.ReactElement<FieldErrorProps<C>> | null;

const FieldError: FieldErrorComponent = forwardRef(function FieldError<
  C extends React.ElementType = 'div',
>({ as, children, ...rest }: FieldErrorProps<C>, ref?: PolymorphicRef<C>) {
  const className = clsx(rest.className, styles['field-error']);
  const asComponent: React.ElementType = as || 'div';
  if (!children) {
    return null;
  }

  return (
    <Text
      as={asComponent}
      {...rest}
      color="urgent-600"
      className={className}
      ref={ref}
      variant="body-sm"
    >
      <IconCritical
        className={styles['error-icon']}
        variant="md"
        aria-hidden="true"
        marginRight={50}
      />
      <VisuallyHidden>Error:</VisuallyHidden>
      {children}
    </Text>
  );
});

export default FieldError as typeof FieldError;
