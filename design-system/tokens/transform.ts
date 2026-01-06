import StyleDictionary from 'style-dictionary';
import config from './config.json';

async function build() {
  const sd = new StyleDictionary(config);
  await sd.hasInitialized;

  // this transform wraps media queries in quotes, required for scss
  sd.registerTransform({
    type: 'value',
    name: 'content/mediaQuery',
    transitive: true,
    filter: (token) =>
      token.attributes?.category === 'content' && token.attributes?.type === 'mediaQuery',
    transform: (token) => `'${token.value}'`,
  });

  sd.registerTransform({
    ...sd.hooks.transforms['content/quote']!,
    type: 'value',
    name: 'content/quote/transitive',
    transitive: true,
  });

  sd.registerTransform({
    ...sd.hooks.transforms['size/rem']!,
    type: 'value',
    name: 'size/font/rem',
    filter: (token) => token.attributes?.category === 'size' && token.attributes?.type === 'font',
  });

  sd.registerTransformGroup({
    name: 'scss',
    transforms: [
      'name/kebab',
      'size/px',
      'size/font/rem',
      'color/css',
      'content/mediaQuery',
      'content/quote/transitive',
    ],
  });

  sd.registerTransformGroup({
    name: 'json',
    transforms: ['size/px', 'size/font/rem', 'color/css'],
  });

  sd.registerTransformGroup({
    name: 'js',
    transforms: ['name/constant', 'size/px', 'size/font/rem', 'color/css'],
  });

  await sd.buildAllPlatforms();
}

build()
  .then(() => console.log('Style Dictionary Build Completed!'))
  .catch((error) => {
    console.error('Style Dictionary Build Failed!', error);
    process.exit(1);
  });
