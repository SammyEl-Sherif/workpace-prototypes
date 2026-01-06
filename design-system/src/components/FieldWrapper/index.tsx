import clsx from 'clsx';
import styles from './FieldWrapper.module.scss';
import Box from '../Box';
import getStateColors from './getStateColors';
import Icon from './Icon';
import React from 'react';
interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'color'> {
  hasError: boolean;
  disabled?: boolean;
  isFieldFocused: boolean;
  multiline?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const FieldWrapper = ({
  hasError = false,
  disabled,
  isFieldFocused = false,
  multiline = false,
  children,
  icon,
  ...rest
}: Props) => {
  const fielldClassName = clsx(styles.field, rest.className, {
    [styles.focused]: isFieldFocused && !hasError,
    [styles['error-focused']]: isFieldFocused && hasError,
    [styles['has-icon']]: Boolean(icon),
    [styles.multi]: multiline,
  });
  const colors = getStateColors({ hasError, disabled, isFieldFocused });
  return (
    <Box
      {...rest}
      borderColor={colors.border}
      backgroundColor={colors.background}
      className={fielldClassName}
    >
      {children}
      {icon && <Icon icon={icon} multiline={multiline} />}
    </Box>
  );
};

export default FieldWrapper;
