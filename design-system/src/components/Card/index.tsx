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
) => React.ReactElement<CardProps<C>> | null;

const Card: CardComponent = forwardRef(function Card<C extends React.ElementType = 'div'>(
  { as, children, variant = 'default', ...rest }: CardProps<C>,
  ref?: PolymorphicRef<C>,
) {
  const asComponent: React.ElementType = as || 'div';

  const className = clsx(
    rest.className,
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

export const CardHeader: React.FC<CardHeaderProps> = ({ children, center = false, ...rest }) => {
  const className = clsx(
    rest.className,
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

export const CardTitle: React.FC<CardTitleProps> = ({ children, ...rest }) => {
  return (
    <Text
      as="h4"
      className={clsx(rest.className, styles.cardTitle)}
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

export const CardContent: React.FC<CardContentProps> = ({ children, ...rest }) => {
  return (
    <div className={clsx(rest.className, styles.cardContent)} {...rest}>
      {children}
    </div>
  );
};

// Card Footer Component
export interface CardFooterProps extends MarginProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, ...rest }) => {
  return (
    <div className={clsx(rest.className, styles.cardFooter)} {...rest}>
      {children}
    </div>
  );
};

export default Card as typeof Card;
