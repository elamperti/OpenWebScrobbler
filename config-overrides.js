const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin');
const moduleToCdn = require('module-to-cdn');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function createDynamicCdnObject(moduleName, version, globalVarName, url) {
  return {
    name: moduleName,
    var: globalVarName,
    url,
    version
  };
}

module.exports = function override(config, env) {
  if (process.env.NODE_ENV !== 'development') {
    config.plugins = [
      ...config.plugins,
      new DynamicCdnWebpackPlugin({
        verbose: !!process.env.LIST_CDN_BUNDLES,
        options: {

        },
        resolver(moduleName, version) {
          var url;

          switch (moduleName) {
            case '@sentry/browser':
              url = `https://browser.sentry-cdn.com/${version}/bundle.min.js`;
              return createDynamicCdnObject(moduleName, version, 'Sentry', url);

            default:
              return moduleToCdn(moduleName, version, {env: 'production'});
          };
        },
      }),
    ];
  }

  if (process.env.ANALYZE_BUNDLE) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
}
