/* 
- https://www.benmvp.com/blog/forwarding-refs-polymorphic-react-component-typescript/
- https://www.benmvp.com/blog/polymorphic-react-components-typescript/ 
*/

import React, { JSX } from 'react';

/* A more precise version of React.ComponentPropsWithoutRef */
type PropsOf<C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> =
  React.JSX.LibraryManagedAttributes<C, React.ComponentPropsWithoutRef<C>>;

/* Override of default HTML tag which can also be another React component */
type AsProp<C extends React.ElementType> = {
  as?: C;
};

/* For extending a set of props (ExtendedProps) by an overriding set (OverrideProps), ensuring that all duplicates are overriden */
type ExtendableProps<ExtendedProps = {}, OverrideProps = {}> = OverrideProps &
  Omit<ExtendedProps, keyof OverrideProps>;

/* For inheriting the props from the specificed element type so that props like children, className, and style work, as well as element-specfic attributes like aria roles. The component 'C' must be passed in. */
type InheritableElementProps<C extends React.ElementType, Props = {}> = ExtendableProps<
  PropsOf<C>,
  Props
>;

/* Enhanced version of InheritableElementProps where the passed in 'as' prop will determine which props can be included */
type PolymorphicComponentProps<C extends React.ElementType, Props = {}> = InheritableElementProps<
  C,
  Props & AsProp<C>
>;

/* Utility type for extracting the 'ref' prop from a polymorphic component */
export type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref'];

/* A wrapper of PolymorphicComponentProps that includes 'ref' prop for a polymorphic component */
export type PolymorphicComponentPropsWithRef<
  C extends React.ElementType,
  Props = {},
> = PolymorphicComponentProps<C, Props> & { ref?: PolymorphicRef<C> };
