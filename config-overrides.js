
const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin');
const moduleToCdn = require('module-to-cdn');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {
  override,
  addWebpackPlugin,
} = require("customize-cra");

function createDynamicCdnObject(moduleName, version, globalVarName, url) {
  return {
    name: moduleName,
    var: globalVarName,
    url,
    version
  };
}

module.exports = override(
  process.env.NODE_ENV !== 'development' && addWebpackPlugin(
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
        }
      },
    })
  ),
  process.env.ANALYZE_BUNDLE && addWebpackPlugin(new BundleAnalyzerPlugin()),
);
