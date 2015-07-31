"use strict";

import Bluebird from "bluebird";
import BaseAdapter from "./BaseAdapter";
import Helpers from "../Helpers";
import mongoose from "mongoose";
import async from "async";

Bluebird.promisifyAll(mongoose);

class MongooseAdapter extends BaseAdapter {
  static defaults() {
    return {
      schemaRootPaths: [
        require("path").join(__dirname, "/../../schemas/mongoose")
      ]
    };
  }

  constructor(app, config) {
    super(app, config, MongooseAdapter.defaults());
    this.migrationSupport = true;
  }

  connect(cb) {
    if (!this.config.uri) {
      err = new Error("Unable to find proper configuration for Mongoose!");
      return cb(err);
    }

    let conn = null;

    let connect = (next) => {
      let opts = this.config.options;
      if (!opts) {
        opts = {};
      }

      if (opts.debug) {
        mongoose.set("debug", opts.debug);
      }

      let uri = this.config.uri;
      if (require("util").isArray(uri)) {
        uri = uri.join(",");
      }

      try {
        conn = mongoose.createConnection(
          uri, opts
        );
      } catch(err) {
        return next(err);
      }

      conn.on("error", function (err) {
        console.error("Error occurred on Mongoose: " + err.message, err.stack);
      });

      conn.once("open", () => {
        next(null);
      });
    };

    let loadSchemas = (next) => {
      let tasks = [];
      let schemaPaths = [];

      if (!this.config.schemaRootPaths) {
        return next(new Error("No schemaRootPaths defined in config!"));
      }

      this.config.schemaRootPaths.forEach((rootPath) => {
        rootPath = require("path").normalize(rootPath);
        let paths = Helpers.walkDirSync(rootPath, {
          ext: [".js"]
        });
        if (paths) {
          schemaPaths = schemaPaths.concat(paths);
        }
      });

      schemaPaths.forEach((schemaPath) => {
        tasks.push((ccb) => {
          let sp;
          try {
            sp = require(schemaPath);
          } catch(err) {
            console.error("Error loading schema: " + schemaPath, err);
            return ccb();
          }
          if (sp.loadSchemas) {
            sp.loadSchemas(mongoose, (schemas) => {
              this._schemas = require("util")._extend(this._schemas, schemas);

              // Read each schema as model once, so mongoose populates its internal index properly
              Object.keys(this._schemas).forEach((name) => {
                this.getModel(name);
              });

              ccb();
            });
          } else {
            ccb();
          }
        });
      });

      async.series(tasks, function (err) {
        next(err);
      });
    };

    connect((err) => {
      if (err) {
        return cb(err);
      }
      this.connection = conn;
      loadSchemas(function(serr) {
        if (serr) {
          return cb(serr);
        }
        cb(null, conn);
      });
    });
  }
  getSchema(name) {
    return this._schemas[name];
  }
  getSchemas() {
    return this._schemas;
  }
  getModel(name, dbName) {
    if (!dbName) {
      dbName = name;
    }

    try {
      return this.connection.model(dbName, this.getSchema(name));
    } catch (err) {
      return this.connection.model(dbName);
    }
  }
  getModels() {
    let models = {};
    Object.keys(this._schemas).forEach((name) => {
      models[name] = this.getModel(name);
    });
    return models;
  }

  getMigrator() {
    return require("./Migrators/Mongoose");
  }
  getFixturesData() {
    return require(require("path").join(this.app.PROJECT_ROOT, "fixtures", "mongoose"));
  }
}

module.exports = MongooseAdapter;
