import { useEffect } from 'react';
import { printDevConsole } from '../helpers';

export const usePrintDevConsole = (
  type: 'error' | 'warn' | 'log',
  condition: boolean,
  message: string,
) => {
  useEffect(() => {
    printDevConsole(type, condition, message);
  }, [type, condition, message]);
};
