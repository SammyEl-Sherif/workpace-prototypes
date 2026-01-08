export type Breakpoints<T> = {
  sm?: T;
  md?: T;
  lg?: T;
};

export function mapBreakpointValues<Old extends string | undefined, New>(
  breakpoints: Old | Breakpoints<Old>,
  callback: (value: Old | undefined) => New,
): Breakpoints<New> | New {
  if (typeof breakpoints !== 'object') {
    return callback(breakpoints);
  }

  const { sm, md, lg } = breakpoints;
  if (sm === md && md === lg) {
    return callback(sm);
  }

  return Object.entries(breakpoints).reduce(
    (breakpoints, [breakpoint, value]) => {
      breakpoints[breakpoint] = callback(value);
      return breakpoints;
    },
    {} as { [key: string]: New },
  );
}
