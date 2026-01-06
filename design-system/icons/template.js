const template = (variables, { tpl }) => {
  const component = variables.componentName.replace('Svg', '');
  return tpl`
    /** 
     * This file was automatically generated and should not be edited.
     */

    import React, { forwardRef } from 'react';
    import IconTemplate, { IconProps, SVGIconProps } from "../Icon"

    const Icon = forwardRef<SVGSVGElement, SVGIconProps>(function Icon(
      { title, titleId, ...props },
      ref
    ) {
    return ${variables.jsx}
    })

    type Props = Omit<IconProps, "Icon">

    const ${component} = forwardRef<SVGSVGElement, Props>(function ${component}(
      props,
      ref
    ) {
      return <IconTemplate {...props} Icon={Icon} ref={ref} />
    });

    export default ${component};
  `;
};

module.exports = template;
