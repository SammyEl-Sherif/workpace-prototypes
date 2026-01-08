import { ColorValue } from '../Box';

interface StateAttibutes {
  disabled?: boolean;
  hasError: boolean;
  isFieldFocused: boolean;
}

const getStateColors = ({ disabled, hasError, isFieldFocused }: StateAttibutes) => {
  let background: ColorValue = 'neutral-white';
  let border: ColorValue = 'neutral-600';
  let text: ColorValue = 'neutral-600';

  if (disabled) {
    background = 'neutral-100';
    border = 'neutral-200';
  } else if (hasError) {
    border = 'urgent-600';
  } else if (isFieldFocused) {
    border = 'active-800';
    text = 'active-800';
  }

  return {
    border,
    text,
    background,
  };
};

export default getStateColors;
