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
  config.plugins = [
    ...config.plugins,
    new DynamicCdnWebpackPlugin({
      verbose: !!process.env.LIST_CDN_BUNDLES,
      resolver(moduleName, version) {
        var url;
        var subModuleName;

        switch (moduleName) {
      //     // case 'reactstrap':
      //     //   url = `https://cdnjs.cloudflare.com/ajax/libs/reactstrap/${version}/reactstrap.min.js`;
      //     //   return createDynamicCdnObject(moduleName, version, 'reactstrap', url);

      //     // case 'i18n':
      //     case 'i18next':
      //       url = `https://cdnjs.cloudflare.com/ajax/libs/i18next/${version}/i18next.min.js`;
      //       return createDynamicCdnObject(moduleName, version, 'i18next', url);

      //     // case 'i18next-xhr-backend':
      //     //   url = `https://cdnjs.cloudflare.com/ajax/libs/i18next-xhr-backend/${version}/i18nextXHRBackend.min.js`;
      //     //   return createDynamicCdnObject(moduleName, version, null, url);

      //     case 'bootswatch/dist/slate/bootstrap.min.css':
      //       url = `https://unpkg.com/bootswatch@${version}/dist/slate/bootstrap.min.css`;
      //       return createDynamicCdnObject(moduleName, version, null, url);

          case '@sentry/browser':
            url = `https://browser.sentry-cdn.com/${version}/bundle.min.js`;
            return createDynamicCdnObject(moduleName, version, 'Sentry', url);

      //     // Probably a bad idea:
      //     // case (moduleName.match(/^date-fns\//) || {}).input:
      //     //   subModuleName = /^date-fns\/(.+)/.exec(moduleName)[1];
      //     //   url = `https://unpkg.com/date-fns@${version}/${subModuleName}/index.js`;
      //     //   return createDynamicCdnObject(moduleName, version, null, url);

          default:
            return moduleToCdn(moduleName, version);
        };
      },
    }),
  ];

  if (env.ANALYZE_BUNDLE) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
}
