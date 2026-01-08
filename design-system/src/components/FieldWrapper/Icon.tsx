import clsx from 'clsx';
import Box from '../Box';
import styles from './Icon.module.scss';
import React from 'react';
interface Props {
  multiline?: boolean;
  icon?: React.ReactNode;
}

const Icon = ({ multiline, icon }: Props) => {
  return (
    <Box
      marginRight={200}
      marginTop={multiline ? 200 : undefined}
      className={clsx({
        [styles.multiline]: multiline,
      })}
    >
      {icon}
    </Box>
  );
};

export default Icon;
