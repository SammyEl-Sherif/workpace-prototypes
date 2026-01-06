/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const path = require('path')

module.exports = () => {
  return {
    reactStrictMode: true,
    skipTrailingSlashRedirect: true,
    output: 'standalone',
    // (Optional) Export as a static site
    // See https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#configuration
    // output: 'export', // Feel free to modify/remove this option

    // Override the default webpack configuration
    webpack: (config) => {
      // See https://webpack.js.org/configuration/resolve/#resolvealias
      config.resolve.alias = {
        ...config.resolve.alias,
        sharp$: false,
        'onnxruntime-node$': false,
      }
      return config
    },
    sassOptions: {
      includePaths: [
        path.join(__dirname, '..', 'node_modules'),
        path.join(__dirname, '..', 'design-system', 'src', 'styles'),
        path.join(__dirname, '..', 'design-system', 'dist'),
      ],
      importer: [
        function (url) {
          const fs = require('fs')

          // Resolve @workpace/design-system/dist/design-tokens to the actual file
          if (url === '@workpace/design-system/dist/design-tokens') {
            const distPath = path.join(
              __dirname,
              '..',
              'design-system',
              'dist',
              '_design-tokens.scss'
            )
            const srcPath = path.join(
              __dirname,
              '..',
              'design-system',
              'src',
              'styles',
              '_design-tokens.scss'
            )

            // Prefer dist if it exists (after build), otherwise fall back to src
            if (fs.existsSync(distPath)) {
              return { file: distPath }
            } else if (fs.existsSync(srcPath)) {
              return { file: srcPath }
            }
          }
          // Return null to use default Sass resolution
          return null
        },
      ],
    },
  }
}
