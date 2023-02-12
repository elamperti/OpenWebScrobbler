const webpackPlugins = [];
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

if (process.env.ANALYZE_BUNDLE) {
  webpackPlugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
  babel: {
    plugins: [
      [
        '@locator/babel-jsx/dist',
        {
          env: 'development',
        },
      ],
      [
        'babel-plugin-jsx-remove-data-test-id',
        {
          attributes: 'data-cy',
        },
      ],
    ],
  },
  webpack: {
    plugins: webpackPlugins,
  },
};
