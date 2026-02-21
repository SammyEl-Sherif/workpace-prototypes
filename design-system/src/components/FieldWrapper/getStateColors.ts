import { ColorValue } from '../Box';

interface StateAttibutes {
  disabled?: boolean;
  hasError: boolean;
  isFieldFocused: boolean;
  dark?: boolean;
}

const getStateColors = ({ disabled, hasError, isFieldFocused, dark }: StateAttibutes) => {
  let background: ColorValue = dark ? 'neutral-900' : 'neutral-white';
  let border: ColorValue = dark ? 'neutral-700' : 'neutral-600';
  let text: ColorValue = dark ? 'neutral-400' : 'neutral-600';

  if (disabled) {
    background = dark ? 'neutral-800' : 'neutral-100';
    border = dark ? 'neutral-700' : 'neutral-200';
  } else if (hasError) {
    border = dark ? 'error-400' : 'error-600';
  } else if (isFieldFocused) {
    border = dark ? 'primary-400' : 'primary-600';
    text = dark ? 'primary-400' : 'primary-600';
  }

  return {
    border,
    text,
    background,
  };
};

export default getStateColors;
