const babelPlugins = [];
const webpackPlugins = [];
const isDevEnvironment = process.env.NODE_ENV === 'development';
const isProdEnvironment = process.env.NODE_ENV === 'production';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

if (process.env.ANALYZE_BUNDLE) {
  webpackPlugins.push(new BundleAnalyzerPlugin());
}

// Add LocatorJS in development
babelPlugins.push([
  '@locator/babel-jsx/dist',
  {
    env: 'development',
  },
]);

// Remove data-cy attribute from elements
if (isProdEnvironment) {
  babelPlugins.push([
    'babel-plugin-jsx-remove-data-test-id',
    {
      attributes: 'data-cy',
    },
  ]);
}

module.exports = {
  babel: {
    plugins: babelPlugins,
  },
  webpack: {
    plugins: webpackPlugins,
    configure: {
      externals: {
        'redux-logger': isDevEnvironment ? false : 'window',
      },
    },
  },
};
