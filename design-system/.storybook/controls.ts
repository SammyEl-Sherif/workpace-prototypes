import { color, size } from '../tokens/design-tokens.json';

export const boolean = () => {
  return {
    control: 'boolean',
  };
};

export const text = () => {
  return {
    control: 'text',
  };
};

export const disable = {
  table: {
    disable: true,
  },
};

export const radio = (options: Array<string> | Array<number>) => {
  return {
    control: 'radio',
    options,
  };
};

export const inlineRadio = (options: Array<string> | Array<number>) => {
  return {
    control: 'radio-inline',
    options,
  };
};

export const select = (options: Array<string> | Array<number>) => {
  return {
    control: {
      type: 'select',
    },
    options,
  };
};

export const colors = {
  options: Object.entries(color).reduce((colorTokens, [palleteName, palleteValues]) => {
    const pallete = Object.keys(palleteValues).map((scale) => {
      return `${palleteName}-${scale}`;
    });

    return colorTokens.concat(pallete);
  }, [] as Array<string>),
  control: 'select',
};

export const spacing = {
  options: Object.keys(size).map((value) => Number(value)),
  control: {
    type: 'select',
  },
};

export const colorArgTypes = {
  backgroundColor: colors,
  borderColor: colors,
  color: colors,
};

export const marginArgTypes = {
  margin: spacing,
  marginX: spacing,
  marginY: spacing,
  marginTop: spacing,
  marginRight: spacing,
  marginBottom: spacing,
  marginLeft: spacing,
};

export const paddingArgTypes = {
  padding: spacing,
  paddingX: spacing,
  paddingY: spacing,
  paddingTop: spacing,
  paddingRight: spacing,
  paddingBottom: spacing,
  paddingLeft: spacing,
};

export const stylePropsArgTypes = {
  ...colorArgTypes,
  ...marginArgTypes,
  ...paddingArgTypes,
};
