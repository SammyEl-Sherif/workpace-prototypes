export const printDevConsole = (
  type: 'error' | 'warn' | 'log',
  condition: boolean,
  message: string,
) => {
  let label;
  switch (type) {
    case 'error':
      label = 'Error';
      break;
    case 'warn':
      label = 'Warning';
      break;
    case 'log':
      label = 'Info';
      break;
  }
  if (condition) {
    console[type](`[WDS] ${label}: ${message}`);
  }
};
