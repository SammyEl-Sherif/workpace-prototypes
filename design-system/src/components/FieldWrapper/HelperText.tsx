import Text from '../Text';
import React from 'react';
interface Props {
  children: React.ReactNode;
}

const HelperText = ({ children }: Props) => {
  return (
    <Text as="div" variant="body-sm" color="neutral-600" marginTop={50}>
      {children}
    </Text>
  );
};

export default HelperText;
