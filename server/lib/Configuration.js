"use strict";

import Helpers from "./Helpers";
import fs from "fs";
import path from "path";

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

Configuration.load = (projectRoot, configDir, defs={}, next) => {
  let env = "development";
  if (process.env.NODE_ENV) {
    env = process.env.NODE_ENV;
  }

  let config = {
    env: env
  };

  let getConfig = (file) => {
    try {
      return require(file)(projectRoot);
    } catch (err) {
      console.error("Error reading config file " + file, err);
      //console.log(err.stack);
    }
  };

  config = Helpers.merge(config, defs);

  // Read in defaults
  let defaults = getConfig(path.join(configDir, "defaults.js"));
  config = Helpers.merge(config, defaults);

  // Get environment specific config, if exists
  if (env === "test" && exists(path.join(configDir, "development.js"))) {
    let envCfg = getConfig(path.join(configDir, "development.js"));
    config = Helpers.merge(config, envCfg);
  }

  if (exists(path.join(configDir, env + ".js"))) {
    let envCfg = getConfig(path.join(configDir, env + ".js"));
    config = Helpers.merge(config, envCfg);
  }

  // Load local overrides
  if (exists(path.join(configDir, "locals.js"))) {
    let envCfg = getConfig(path.join(configDir, "locals.js"));
    config = Helpers.merge(config, envCfg);
  }

  next(null, config);
};
