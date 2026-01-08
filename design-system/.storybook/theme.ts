import { create } from '@storybook/theming';
import { font, color } from '../tokens/design-tokens.json';

export default create({
  base: 'light',
  brandTitle: 'WorkPace',
  brandImage: './images/logo.png',
  brandUrl: 'https://github.com/work-pace/design-system',

  colorPrimary: color.urgent[600],
  colorSecondary: color.neutral[800],

  fontBase: font.stack,
  textColor: color.neutral.black,
  textInverseColor: color.neutral.white,
});
