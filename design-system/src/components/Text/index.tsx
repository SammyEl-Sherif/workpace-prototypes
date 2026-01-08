import React, { forwardRef } from 'react';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../polymorphic-component-types';
import Box, { BaseBoxProps } from '../Box';
import { Breakpoints } from '../../breakpoints';
import styles from './Text.module.scss';
import clsx from 'clsx';

export type ButtonTextVariant = 'button-md' | 'button-md-emphasis' | 'button-sm';

export type HeadlineVariants =
  | 'headline-display'
  | 'headline-display-emphasis'
  | 'headline-lg'
  | 'headline-lg-emphasis'
  | 'headline-md'
  | 'headline-md-emphasis'
  | 'headline-sm'
  | 'headline-sm-emphasis';

export type Variant =
  | HeadlineVariants
  | 'body-lg'
  | 'body-lg-emphasis'
  | 'body-lg-paragraph'
  | 'body-lg-paragraph-emphasis'
  | 'body-md'
  | 'body-md-emphasis'
  | 'body-md-paragraph'
  | 'body-md-paragraph-emphasis'
  | 'body-sm'
  | 'body-sm-emphasis'
  | 'body-sm-paragraph'
  | 'body-sm-paragraph-emphasis'
  | 'body-xs'
  | 'body-xs-emphasis'
  | 'body-xs-paragraph'
  | 'body-xs-paragraph-emphasis'
  | ButtonTextVariant;

export interface BaseTextProps extends BaseBoxProps {
  /** Write a prop description. */
  variant?: Variant | Breakpoints<Variant>;
  /** When set to true, the text is bolded. */
  emphasis?: boolean;
}

type TextProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, BaseTextProps>;

type TextComponent = <C extends React.ElementType = 'span'>(
  props: TextProps<C>,
) => React.ReactElement<TextProps<C>> | null;

type BreakpointsPrefix = 'lg-' | 'md-' | 'sm-' | '';

function getParsedClassNames(value: Variant, prefix: BreakpointsPrefix = '') {
  const variant = value.split('-emphasis')[0];
  const variantClassName = styles[`${prefix}${variant}` as keyof typeof styles];

  const emphasisClassName = value.includes('emphasis')
    ? styles[`${prefix}emphasis` as keyof typeof styles]
    : undefined;
  return [variantClassName, emphasisClassName];
}

function getVariantClasses(value?: Variant | Breakpoints<Variant>) {
  if (typeof value == 'undefined') {
    return '';
  }

  if (typeof value === 'string') {
    return getParsedClassNames(value);
  }

  if (value && typeof value === 'object') {
    return [
      value.sm && getParsedClassNames(value.sm, 'sm-'),
      value.md && getParsedClassNames(value.md, 'md-'),
      value.lg && getParsedClassNames(value.lg, 'lg-'),
    ];
  }

  return undefined;
}

const Text: TextComponent = forwardRef(function Text<C extends React.ElementType = 'span'>(
  { as, children, variant, emphasis = false, ...rest }: TextProps<C>,
  ref?: PolymorphicRef<C>,
) {
  const component: React.ElementType = as || 'span';
  const className = clsx(rest.className, getVariantClasses(variant), {
    [styles.font]: variant,
    [styles.emphasis]: emphasis,
  });

  return (
    <Box as={component} ref={ref} {...rest} className={className}>
      {children}
    </Box>
  );
});

export default Text as typeof Text;
