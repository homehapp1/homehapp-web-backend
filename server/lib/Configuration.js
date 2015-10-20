import Helpers from './Helpers';
import fs from 'fs';
import path from 'path';

let Configuration = exports = module.exports = {};

/**
* Check if given file exists
*/
let exists = Configuration.exists = (filename) => {
  if (!filename) {
    return false;
  }
  try {
    fs.statSync(filename);
    return true;
  } catch (err) {
    return false;
  }
};

let getConfig = null;

let getConfigForEnvironment = function getConfigForEnvironment(configDir, projectName, environment) {
  let config = {};
  let envCfg = getConfig(path.join(configDir, environment + '.js'));
  config = Helpers.merge(config, envCfg);
  if (exists(path.join(configDir, projectName, environment + '.js'))) {
    envCfg = getConfig(path.join(configDir, projectName, environment + '.js'));
    config = Helpers.merge(config, envCfg);
  }
  return config;
};

Configuration.load = function load(projectRoot, projectName, configDir, defs={}, next) {
  let env = 'development';
  if (process.env.NODE_ENV) {
    env = process.env.NODE_ENV;
  }

  let config = {
    env: env
  };

  getConfig = (file) => {
    try {
      return require(file)(projectRoot);
    } catch (err) {
      console.error('Error reading config file ' + file, err);
      //console.log(err.stack);
    }
    return {};
  };

  config = Helpers.merge(config, defs);

  // Read in defaults
  let defaults = getConfigForEnvironment(configDir, projectName, 'defaults');
  config = Helpers.merge(config, defaults);

  // Get environment specific config, if exists

  if (env === 'test' && exists(path.join(configDir, 'development.js'))) {
    let envCfg = getConfigForEnvironment(configDir, projectName, 'development');
    config = Helpers.merge(config, envCfg);
  }

  if (exists(path.join(configDir, env + '.js'))) {
    let envCfg = getConfigForEnvironment(configDir, projectName, env);
    config = Helpers.merge(config, envCfg);
  }

  // Load local overrides
  if (exists(path.join(configDir, 'locals.js'))) {
    let envCfg = getConfigForEnvironment(configDir, projectName, 'locals');
    config = Helpers.merge(config, envCfg);
  }

  next(null, config);
};
