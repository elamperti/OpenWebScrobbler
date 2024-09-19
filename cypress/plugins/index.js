const fs = require('fs');
const path = require('path');

module.exports = (on, config) => {
  /*
   * Override config for particular environments
   */
  const pathToConfigFile = path.resolve(
    __dirname,
    '../config/',
    `cypress.${process.env.NODE_ENV || 'development'}.json`
  );
  try {
    config = {
      ...config,
      ...JSON.parse(fs.readFileSync(pathToConfigFile)),
    };
    // eslint-disable-next-line no-console
    console.info(`Using config file ${pathToConfigFile}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // eslint-disable-next-line no-console
      console.warn(`Couldn't find overrides in ${pathToConfigFile}`);
    } else {
      // eslint-disable-next-line no-console
      console.error(`Error parsing config file ${pathToConfigFile}\n`, error);
    }
  }

  // require('@cypress/code-coverage/task')(on, config);

  return config;
};
