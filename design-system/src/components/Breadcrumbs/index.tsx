import React, { forwardRef } from 'react';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../polymorphic-component-types';
import { MarginProps } from '../Box';
import Text from '../Text';
import styles from './Breadcrumbs.module.scss';
import clsx from 'clsx';

export interface BreadcrumbItem {
  /** The display label for this breadcrumb segment. */
  label: string;
  /** The URL to navigate to. If omitted, the item renders as plain text (typically the current page). */
  href?: string;
}

type Size = 'sm' | 'md' | 'lg';

export interface Props extends MarginProps {
  /** Ordered list of breadcrumb items from root to current page. */
  items: BreadcrumbItem[];
  /** Custom separator between breadcrumb items. Defaults to "/" */
  separator?: React.ReactNode;
  /** The component to render links with (e.g. Next.js Link). Falls back to <a>. */
  linkAs?: React.ElementType;
  /** Size variant. */
  size?: Size;
}

export type BreadcrumbsProps<C extends React.ElementType> =
  PolymorphicComponentPropsWithRef<C, Props>;

type BreadcrumbsComponent = <C extends React.ElementType = 'nav'>(
  props: BreadcrumbsProps<C>,
) => React.ReactNode;

// @ts-expect-error - Generic forwardRef is not directly supported in TypeScript
const Breadcrumbs = forwardRef(function Breadcrumbs<
  C extends React.ElementType = 'nav',
>(
  {
    as,
    items,
    separator = '/',
    linkAs,
    size = 'md',
    className: userClassName,
    ...rest
  }: BreadcrumbsProps<C>,
  ref?: PolymorphicRef<C>,
) {
  const asComponent: React.ElementType = as || 'nav';
  const LinkComponent: React.ElementType = linkAs || 'a';

  const className = clsx(userClassName, styles.breadcrumbs, styles[size]);

  return (
    <Text
      as={asComponent}
      className={className}
      ref={ref}
      aria-label="Breadcrumb"
      {...rest}
    >
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {!isLast && item.href ? (
                <LinkComponent href={item.href} className={styles.link}>
                  {item.label}
                </LinkComponent>
              ) : (
                <span
                  className={clsx(styles.current, {
                    [styles.inactive]: !isLast && !item.href,
                  })}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className={styles.separator} aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </Text>
  );
});

export default Breadcrumbs as BreadcrumbsComponent;
