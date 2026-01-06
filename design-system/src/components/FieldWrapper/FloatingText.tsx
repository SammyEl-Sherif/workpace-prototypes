import getStateColors from './getStateColors';
import styles from './FloatingText.module.scss';
import clsx from 'clsx';
import Text from '../Text';
import React from 'react';
interface Props {
  hasError: boolean;
  disabled?: boolean;
  htmlFor: string;
  isFieldFocused: boolean;
  isOptional?: boolean;
  hasIcon?: boolean;
  multiline?: boolean;
  stayAfloat?: boolean;
  floatAlign?: 'left' | 'center';
  children: React.ReactNode;
}

const FloatingText = ({
  hasError = false,
  disabled,
  isFieldFocused,
  hasIcon = false,
  multiline = false,
  stayAfloat = false,
  floatAlign = 'left',
  children,
  isOptional = false,
  htmlFor,
}: Props) => {
  const floatingClasses = clsx(
    styles['floating-text'],
    multiline ? styles.multiline : styles['single-line'],
    {
      [styles['stay-afloat']]: stayAfloat,
      [styles.error]: hasError,
    },
  );

  const labelClasses = clsx(floatingClasses, styles[floatAlign]);
  const optionalClasses = clsx(floatingClasses, styles.optional, {
    [styles['has-icon']]: hasIcon,
  });

  const colors = getStateColors({ hasError, disabled, isFieldFocused });

  return (
    <>
      <Text
        as="label"
        htmlFor={htmlFor}
        id={`${htmlFor}-label`}
        variant="body-md"
        paddingX={50}
        className={labelClasses}
        color={colors.text}
      >
        {children}
      </Text>
      {isOptional && (
        <Text
          as="label"
          htmlFor={htmlFor}
          aria-hidden
          variant="body-md"
          color={colors.text}
          paddingX={50}
          className={optionalClasses}
        >
          Optional
        </Text>
      )}
    </>
  );
};

export default FloatingText;
