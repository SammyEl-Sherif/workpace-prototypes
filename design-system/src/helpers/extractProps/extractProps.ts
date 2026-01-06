type ContainerStylePropNames =
  | 'className'
  | 'style'
  | 'margin'
  | 'marginX'
  | 'marginY'
  | 'marginTop'
  | 'marginRight'
  | 'marginBottom'
  | 'marginLeft';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractProps = <P extends Record<string, any>>(
  props: P,
): [Pick<P, ContainerStylePropNames>, Omit<P, ContainerStylePropNames>] => {
  const {
    className,
    style,
    margin,
    marginX,
    marginY,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    ...rest
  } = props;

  return [
    {
      className,
      style,
      margin,
      marginX,
      marginY,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
    },
    rest,
  ];
};

export default extractProps;
