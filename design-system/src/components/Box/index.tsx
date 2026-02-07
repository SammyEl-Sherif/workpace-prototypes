import React, { forwardRef } from 'react';
import styles from './Box.module.scss';
import clsx from 'clsx';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../polymorphic-component-types';
import { Breakpoints } from '../../breakpoints';

export type SpacingRange =
  | 25
  | 50
  | 75
  | 100
  | 125
  | 150
  | 200
  | 250
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;

export type ColorValue =
  | 'neutral-50'
  | 'neutral-100'
  | 'neutral-200'
  | 'neutral-300'
  | 'neutral-400'
  | 'neutral-600'
  | 'neutral-700'
  | 'neutral-800'
  | 'neutral-900'
  | 'neutral-black'
  | 'neutral-white'
  | 'primary-600'
  | 'primary-700'
  | 'error-600'
  | 'error-700'
  | 'active-500'
  | 'active-600'
  | 'active-700'
  | 'active-800'
  | 'accent-500'
  | 'accent-600'
  | 'accent-700';

export type Spacing = SpacingRange | Breakpoints<SpacingRange | undefined> | undefined;
export type Color = ColorValue | Breakpoints<ColorValue | undefined> | undefined;

export interface BaseBoxProps {
  margin?: Spacing;
  marginX?: Spacing;
  marginY?: Spacing;
  marginTop?: Spacing;
  marginRight?: Spacing;
  marginBottom?: Spacing;
  marginLeft?: Spacing;
  padding?: Spacing;
  paddingX?: Spacing;
  paddingY?: Spacing;
  paddingTop?: Spacing;
  paddingRight?: Spacing;
  paddingBottom?: Spacing;
  paddingLeft?: Spacing;
  color?: Color;
  borderColor?: Color;
  backgroundColor?: Color;
  children?: React.ReactNode;
}

export type MarginProps = Pick<
  BaseBoxProps,
  'margin' | 'marginX' | 'marginY' | 'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft'
>;
export type PaddingProps = Pick<
  BaseBoxProps,
  | 'padding'
  | 'paddingX'
  | 'paddingY'
  | 'paddingTop'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingLeft'
>;

type BoxProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, BaseBoxProps>;

type BoxComponent = <C extends React.ElementType = 'div'>(
  props: BoxProps<C> & { ref?: PolymorphicRef<C> },
) => React.ReactNode;

function getPropClasses(value: Spacing | Color | undefined, prefix: string) {
  // if passed a single value
  if (typeof value === 'number' || typeof value === 'string') {
    return styles[`${prefix}-${value}` as keyof typeof styles];
  }

  // otherwise return a class for each breakpoint
  if (value && typeof value === 'object') {
    return [
      styles[`${prefix}-sm-${value.sm}` as keyof typeof styles],
      styles[`${prefix}-md-${value.md}` as keyof typeof styles],
      styles[`${prefix}-lg-${value.lg}` as keyof typeof styles],
    ];
  }

  return undefined;
}

// @ts-expect-error - Generic forwardRef is not directly supported in TypeScript
const Box = forwardRef(function Box<C extends React.ElementType = 'div'>(
  props: BoxProps<C>,
  ref?: PolymorphicRef<C>,
) {
  const {
    margin,
    marginX,
    marginY,
    marginTop,
    marginRight,
    marginLeft,
    marginBottom,
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingLeft,
    paddingBottom,
    color,
    borderColor,
    backgroundColor,
    children,
    ...rest
  } = props;

  const Tag: React.ElementType = rest.as || 'div';

  const pt: Breakpoints<SpacingRange> | Spacing = paddingTop || paddingY;
  const pb: Breakpoints<SpacingRange> | Spacing = paddingBottom || paddingY;
  const pl: Breakpoints<SpacingRange> | Spacing = paddingLeft || paddingX;
  const pr: Breakpoints<SpacingRange> | Spacing = paddingRight || paddingX;
  const mt: Breakpoints<SpacingRange> | Spacing = marginTop || marginY;
  const mb: Breakpoints<SpacingRange> | Spacing = marginBottom || marginY;
  const ml: Breakpoints<SpacingRange> | Spacing = marginLeft || marginX;
  const mr: Breakpoints<SpacingRange> | Spacing = marginRight || marginX;
  const propClassNames = [];

  // IF the prop exists add the corresponding classNames
  padding && propClassNames.push(getPropClasses(padding, 'pad'));
  pt && propClassNames.push(getPropClasses(pt, 'pad-t'));
  pb && propClassNames.push(getPropClasses(pb, 'pad-b'));
  pl && propClassNames.push(getPropClasses(pl, 'pad-l'));
  pr && propClassNames.push(getPropClasses(pr, 'pad-r'));
  margin && propClassNames.push(getPropClasses(margin, 'mar'));
  mt && propClassNames.push(getPropClasses(mt, 'pad-t'));
  mb && propClassNames.push(getPropClasses(mb, 'pad-b'));
  ml && propClassNames.push(getPropClasses(ml, 'pad-l'));
  mr && propClassNames.push(getPropClasses(mr, 'pad-r'));
  color && propClassNames.push(getPropClasses(color, 'color'));
  backgroundColor && propClassNames.push(getPropClasses(backgroundColor, 'bgc'));
  borderColor && propClassNames.push(getPropClasses(borderColor, 'bdc'));

  const className = clsx(rest.className, ...propClassNames);
  const TagComponent = Tag as any;
  return (
    <TagComponent {...rest} ref={ref} className={className}>
      {children}
    </TagComponent>
  );
});

export default Box as BoxComponent;
