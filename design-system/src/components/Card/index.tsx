import React, { forwardRef } from 'react';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../polymorphic-component-types';
import { MarginProps } from '../Box';
import Text from '../Text';
import styles from './Card.module.scss';
import clsx from 'clsx';

type Variant = 'default' | 'gradient' | 'hero';

export interface Props extends MarginProps {
  children: React.ReactNode;
  variant?: Variant;
}

export type CardProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>;

type CardComponent = <C extends React.ElementType = 'div'>(
  props: CardProps<C>,
) => React.ReactNode;

// @ts-expect-error - Generic forwardRef is not directly supported in TypeScript
const Card = forwardRef(function Card<C extends React.ElementType = 'div'>(
  { as, children, variant = 'default', className: userClassName, ...rest }: CardProps<C>,
  ref?: PolymorphicRef<C>,
) {
  const asComponent: React.ElementType = as || 'div';

  const className = clsx(
    userClassName,
    styles.card,
    styles[variant],
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

// Card Header Component
export interface CardHeaderProps extends MarginProps {
  children: React.ReactNode;
  center?: boolean;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, center = false, className: userClassName, ...rest }) => {
  const className = clsx(
    userClassName,
    styles.cardHeader,
    center && styles.center,
  );

  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
};

// Card Title Component
export interface CardTitleProps extends MarginProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className: userClassName, ...rest }) => {
  return (
    <Text
      as="h4"
      className={clsx(userClassName, styles.cardTitle)}
      variant="headline-sm"
      {...rest}
    >
      {children}
    </Text>
  );
};

// Card Content Component
export interface CardContentProps extends MarginProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className: userClassName, ...rest }) => {
  return (
    <div className={clsx(userClassName, styles.cardContent)} {...rest}>
      {children}
    </div>
  );
};

// Card Footer Component
export interface CardFooterProps extends MarginProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className: userClassName, ...rest }) => {
  return (
    <div className={clsx(userClassName, styles.cardFooter)} {...rest}>
      {children}
    </div>
  );
};

export default Card as CardComponent;
