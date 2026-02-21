import React, { forwardRef, useState } from 'react';
import Box, { MarginProps } from '../Box';
import useWdsId from '../../hooks/useWdsId';
import extractProps from '../../helpers/extractProps/extractProps';
import FieldWrapper from '../FieldWrapper';
import Text from '../Text';
import styles from './Select.module.scss';
import FloatingText from '../FieldWrapper/FloatingText';
import VisuallyHidden from '../VisuallyHidden';
import FieldError from '../FieldError';
import HelperText from '../FieldWrapper/HelperText';
import IconArrowDown from '../Icons/_icons/IconArrowDown';

interface Props extends Omit<React.ComponentPropsWithoutRef<'select'>, 'color'>, MarginProps {
  label: string;
  placeholder?: string;
  errorText?: string;
  helperText?: string;
  dark?: boolean;
  children: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, placeholder, errorText, helperText, dark, children, ...rest },
  ref,
) {
  const id = useWdsId();
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = (event: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(true);
    if (rest.onFocus) {
      rest.onFocus(event);
    }
  };

  const onBlur = (event: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false);
    if (rest.onBlur) {
      rest.onBlur(event);
    }
  };

  const [containerStyleProps, selectProps] = extractProps(rest);

  const hasError =
    Boolean(rest['aria-invalid']) || (rest['aria-invalid'] === undefined && Boolean(errorText));

  return (
    <Box {...containerStyleProps}>
      <FieldWrapper hasError={hasError} isFieldFocused={isFocused} disabled={rest.disabled} dark={dark}>
        <Text
          as="select"
          {...selectProps}
          ref={ref}
          id={id}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-labelledby={`${id}-label`}
          aria-invalid={hasError}
          variant={'body-md'}
          color={rest.disabled ? 'neutral-600' : dark ? 'neutral-white' : 'neutral-black'}
          paddingY={125}
          paddingLeft={200}
          className={styles.select}
        >
          {placeholder && (
            <option className={styles.placeholder} value="">
              {placeholder}
            </option>
          )}
          {children}
        </Text>
        <FloatingText
          htmlFor={id}
          hasError={hasError}
          isFieldFocused={isFocused}
          disabled={rest.disabled}
          isOptional={!rest.required}
          stayAfloat={true}
          dark={dark}
        >
          {label}
        </FloatingText>
        <span aria-hidden="true" className={styles.icon}>
          <IconArrowDown
            className={isFocused ? styles['icon-arrow'] : undefined}
            color={rest.disabled ? 'neutral-400' : 'active-800'}
            variant="lg"
          />
        </span>
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

export default Select;
