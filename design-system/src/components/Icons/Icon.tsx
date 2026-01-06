import React, { forwardRef } from 'react';
import { Breakpoints } from '../../breakpoints';
import Box, { BaseBoxProps } from '../Box';
import styles from './Icon.module.scss';
import clsx from 'clsx';
import useWdgsId from '../../hooks/useWdsId';
import { useIconVariantContext } from './IconVariantContext';

export type Variants = 'sm' | 'md' | 'lg';

export interface IconProps
  extends Omit<React.ComponentPropsWithoutRef<'svg'>, 'color'>,
    Omit<BaseBoxProps, 'as'> {
  title?: string;
  variant?: Variants | Breakpoints<Variants>;
  Icon: React.ElementType;
}

export interface SVGIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
  titleId?: string;
}

function getVariantClasses(value?: Variants | Breakpoints<Variants> | undefined) {
  if (typeof value === 'string') {
    return styles[`icon-variant-${value}`];
  }

  if (value && typeof value === 'object') {
    return [
      value.sm && styles[`icon-sm-variant-${value.sm}`],
      value.md && styles[`icon-md-variant-${value.md}`],
      value.lg && styles[`icon-lg-variant-${value.lg}`],
    ];
  }

  return undefined;
}

const IconTemplate = forwardRef<SVGSVGElement, IconProps>(function IconTemplate(
  { Icon, title, variant: variantPropValue, ...rest }: IconProps,
  ref,
) {
  const variant = useIconVariantContext(variantPropValue) ?? 'md';

  const titleId = useWdgsId();
  const className = clsx(rest.className, styles.icon, getVariantClasses(variant));

  return (
    <Box
      titleId={title ? titleId : undefined}
      title={title}
      {...rest}
      className={className}
      as={Icon}
      ref={ref}
      aria-hidden={title ? false : true}
    />
  );
});

export default IconTemplate;
