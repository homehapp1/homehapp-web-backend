"use strict";

import path from "path";
import fs from "fs";

import Configuration from "./lib/Configuration";
import Helpers from "./lib/Helpers";
let Migrator = null;

let PROJECT_NAME = "site";
const PROJECT_ROOT = path.resolve(__dirname, "..");
let debug = require("debug")("migration");

exports.run = function run(projectName, action, ...args) {
  console.log("Migrate run", action, args);

  PROJECT_NAME = projectName || "site";

  Configuration.load(PROJECT_ROOT, PROJECT_NAME, path.join(PROJECT_ROOT, "config"), {}, function (configError, config) {
    if (configError) {
      throw configError;
    }

    let app = {
      config: config,
      PROJECT_ROOT: PROJECT_ROOT,
      PROJECT_NAME: PROJECT_NAME
    };

    function connectToDatabase() {
      return new Promise((resolve, reject) => {
        debug("connectToDatabase");
        if (!config.database.adapter) {
          debug("no database adapter configured");
          return resolve();
        }
        require("./lib/Database").configure(app, config.database)
        .then( () => {
          if (!app.db.migrationSupport) {
            return Promise.reject(`No migration support in adapter ${config.database.adaptor}`);
          }
          let MigratorClass = app.db.getMigrator();
          Migrator = new MigratorClass(app);
          resolve();
        })
        .catch( (err) => reject(err) );
      });
    }

    connectToDatabase()
    //.then( () => setupStaticRoutes() )
    .then( () => {
      debug("Migration initialization flow done!");
      return Migrator.execute(action, args);
    })
    .then( () => {
      debug("Migration execution finished!");
    })
    .catch(err => {
      console.error("Error on migration", err);
      console.error(err.stack);
      throw err;
    });
  });
};
