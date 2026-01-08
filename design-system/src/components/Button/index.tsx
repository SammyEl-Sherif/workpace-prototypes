import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { Breakpoints, mapBreakpointValues } from '../../breakpoints';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../polymorphic-component-types';
import { ColorValue, MarginProps } from '../Box';
import Text from '../Text';
import styles from './Button.module.scss';

type Variant = 'brand-primary' | 'brand-secondary' | 'default-primary' | 'default-secondary';

export interface Props extends MarginProps {
  children: React.ReactNode;
  variant?: Variant | Breakpoints<Variant>;
}

export type ButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>;

type ButtonComponent = <C extends React.ElementType = 'button'>(
  props: ButtonProps<C>,
) => React.ReactElement<ButtonProps<C>> | null;

function getVariantClasses(value?: Variant | Breakpoints<Variant>) {
  if (typeof value === 'string') {
    return styles[`${value}`];
  }

  if (value && typeof value === 'object') {
    return [
      value.sm && styles[`${value.sm}-sm`],
      value.md && styles[`${value.md}-md`],
      value.lg && styles[`${value.lg}-lg`],
    ];
  }

  return undefined;
}

const Button: ButtonComponent = forwardRef(function Button<C extends React.ElementType = 'button'>(
  { as, children, variant = 'brand-primary', ...rest }: ButtonProps<C>,
  ref?: PolymorphicRef<C>,
) {
  const asComponent: React.ElementType = as || 'button';

  const className = clsx(
    rest.className,
    styles.button,
    styles.inheritfont,
    getVariantClasses(variant),
  );

  const backgroundColor = mapBreakpointValues<Variant, ColorValue>(variant, (variant) => {
    if (rest.disabled) return 'neutral-200';
    switch (variant) {
      case 'default-primary':
        return 'neutral-900';
      case 'default-secondary':
        return 'neutral-50';
      case 'brand-primary':
        return 'active-500';
      case 'brand-secondary':
        return 'accent-500';
      default:
        return 'neutral-900';
    }
  });
  const borderColor = mapBreakpointValues<Variant, ColorValue>(variant, (variant) => {
    if (rest.disabled) return 'neutral-200';
    switch (variant) {
      case 'brand-primary':
        return 'active-500';
      case 'brand-secondary':
        return 'accent-500';
      case 'default-primary':
        return 'neutral-900';
      case 'default-secondary':
        return 'accent-500';
      default:
        return 'neutral-900';
    }
  });
  const textColor = mapBreakpointValues<Variant, ColorValue>(variant, (variant) => {
    if (rest.disabled) return 'neutral-400';
    switch (variant) {
      case 'default-primary':
        return 'neutral-white';
      case 'default-secondary':
        return 'accent-600';
      case 'brand-primary':
        return 'neutral-white';
      case 'brand-secondary':
        return 'neutral-white';
      default:
        return 'neutral-white';
    }
  });

  return (
    <Text
      as={asComponent}
      className={className}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      color={textColor}
      variant="button-md"
      ref={ref}
      {...rest}
    >
      {children}
    </Text>
  );
});

export default Button as typeof Button;
