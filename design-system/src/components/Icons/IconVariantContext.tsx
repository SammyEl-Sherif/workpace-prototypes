import { createContext, useContext } from 'react';
import { IconProps } from './Icon';
import { usePrintDevConsole } from '../../hooks/usePrintDevConsole';

type VariantContext =
  | {
      variantOverride: IconProps['variant'] | undefined;
      variantProvider: string;
    }
  | Record<string, never>;

const IconVariantContext = createContext<VariantContext>({});

export function useIconVariantContext(variantPropValue?: IconProps['variant']) {
  const { variantOverride, variantProvider } = useContext(IconVariantContext);

  usePrintDevConsole(
    'warn',
    variantOverride !== undefined && variantPropValue !== undefined,
    `${variantProvider} automatically controls the child Icon's variant, overriding any variant you set. Please remove the variant from the Icon that is a child of ${variantProvider}.`,
  );

  return variantOverride ?? variantPropValue;
}

export default IconVariantContext;
