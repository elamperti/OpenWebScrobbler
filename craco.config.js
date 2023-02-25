const babelPlugins = [];
const webpackPlugins = [];
const cracoPlugins = [];
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

  // Based on https://github.com/dilanx/craco/issues/44#issuecomment-573554956
  cracoPlugins.push({
    plugin: {
      overrideWebpackConfig: ({ webpackConfig }) => {
        const minimizerIndex = webpackConfig.optimization.minimizer.findIndex((item) => item.options);

        webpackConfig.optimization.minimizer[minimizerIndex].options = {
          ...webpackConfig.optimization.minimizer[minimizerIndex].options,
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        };

        return webpackConfig;
      },
    },
  });
}

module.exports = {
  plugins: cracoPlugins,
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
  jest: {
    configure: {
      // "collectCoverage": true,
      coverageReporters: ['lcov', 'html'],
      coverageDirectory: '<rootDir>/coverage/',
    },
  },
};
