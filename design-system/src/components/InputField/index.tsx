import React, { forwardRef, useState } from 'react';
import Box, { MarginProps } from '../Box';
import useWdgsId from '../../hooks/useWdsId';
import extractProps from '../../helpers/extractProps/extractProps';
import styles from './InputField.module.scss';
import FieldWrapper from '../FieldWrapper';
import FloatingText from '../FieldWrapper/FloatingText';
import VisuallyHidden from '../VisuallyHidden';
import FieldError from '../FieldError';
import HelperText from '../FieldWrapper/HelperText';

export interface Props extends React.ComponentPropsWithoutRef<'input'>, MarginProps {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  errorText?: React.ReactNode;
  helperText?: React.ReactNode;
}

const InputField = forwardRef<HTMLInputElement, Props>(function InputField(
  { label, icon, errorText, helperText, ...rest },
  ref,
) {
  const id = useWdgsId();
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (rest.onFocus) {
      rest.onFocus(event);
    }
  };
  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (rest.onBlur) {
      rest.onBlur(event);
    }
  };

  const [containerStyleProps, inputProps] = extractProps(rest);
  const hasError =
    Boolean(rest['aria-invalid']) || (rest['aria-invalid'] === undefined && Boolean(errorText));

  return (
    <Box {...containerStyleProps}>
      <FieldWrapper
        hasError={hasError}
        isFieldFocused={isFocused}
        disabled={rest.disabled}
        icon={icon}
      >
        <input
          type="text"
          className={styles.input}
          placeholder=" "
          {...inputProps}
          id={id}
          ref={ref}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-labelledby={`${id}-label`}
          aria-invalid={hasError}
        />
        <FloatingText
          htmlFor={id}
          hasError={hasError}
          isFieldFocused={isFocused}
          disabled={rest.disabled}
          hasIcon={Boolean(icon)}
          isOptional={!rest.required}
        >
          {label}
        </FloatingText>
      </FieldWrapper>
      {hasError && errorText && (
        <div id={`${id}-error-text`}>
          <FieldError marginTop={75}>{errorText}</FieldError>
          <VisuallyHidden>.</VisuallyHidden>
        </div>
      )}
      {helperText && (
        <div id={`${id}-helper-text`}>
          <HelperText>{helperText}</HelperText>
          <VisuallyHidden>.</VisuallyHidden>
        </div>
      )}
    </Box>
  );
});

export default InputField;
