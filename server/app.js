"use strict";

import path from "path";
import fs from "fs";
import http from "http";

import express from "express";

// For Isomorphic React
import React from "react";
import Router from "react-router";
import Iso from "iso";

import Configuration from "./lib/Configuration";
import Helpers from "./lib/Helpers";
import Errors from "./lib/Errors";
import Logger from "./lib/Logger";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const COMMON_CLIENT_ROOT = path.resolve(PROJECT_ROOT, "clients", "common");
const STATICS_ROOT = path.resolve(PROJECT_ROOT, "build", "statics");
const SOURCE_PATH = __dirname;
let CLIENT_ROOT = null;

let debug = require("debug")("app");

exports.run = function(clientName, afterRun) {

  clientName = clientName || "site";
  CLIENT_ROOT = path.resolve(PROJECT_ROOT, "clients", clientName);

  if (typeof afterRun !== "function") {
    afterRun = () => {};
  }

  Configuration.load(PROJECT_ROOT, path.join(PROJECT_ROOT, "config"), {}, function (configError, config) {
    if (configError) {
      throw configError;
    }

    let app = module.exports.app = express();
    app.config = config;
    app.server = http.createServer(app);
    app.PROJECT_ROOT = PROJECT_ROOT;
    app.SOURCE_PATH = SOURCE_PATH;

    app.set("trust proxy", 1);

    // For Isomorphic React
    app.set("view engine", "html");
    app.set("views", path.join(CLIENT_ROOT, "templates"));
    app.engine("html", require("ejs").renderFile);

    /**
     * Configure templating if views folder is present
     */
    // let viewsFolder = path.join(SOURCE_PATH, "views");
    // if (fs.existsSync(path.join(PROJECT_ROOT, "views"))) {
    //   viewsFolder = path.join(PROJECT_ROOT, "views");
    // }
    // if (fs.existsSync(viewsFolder)) {
    //   let ejs = require("ejs");
    //
    //   app.set("view engine", "html");
    //   app.set("views", viewsFolder);
    //   app.engine("html", ejs.renderFile);
    //
    //   let partials = require("express-partials");
    //   partials.register(".html", ejs.render);
    //   app.use(partials());
    //
    //   app.use(require("express-layout")());
    // }

    // For Isomorphic React
    let routes = require(path.join(CLIENT_ROOT, "components/Routes"));
    let alt = require(path.join(COMMON_CLIENT_ROOT, "alt.js"));

    function configureLogger() {
      return new Promise((resolve) => {
        debug("configureLogger");
        let logger = new Logger(config.logging);

        // Add external logging transports here
        // ie. logger.addTransport("Loggly", require("winston-loggly").Loggly);
        logger.configure(app).then(() => resolve());
      });
    }

    function connectToDatabase() {
      return new Promise((resolve, reject) => {
        debug("connectToDatabase");
        if (!app.config.database.adapter) {
          debug("no database adapter configured");
          return resolve();
        }
        require(path.join(SOURCE_PATH, "lib", "Database")).configure(app, app.config.database)
        .then( () => resolve() )
        .catch((err) => {
          app.log.error(`Unable to configure database!: ${err.message}`, err);
          reject(err);
        });
      });
    }

    function setupStaticRoutes() {
      return new Promise((resolve) => {
        debug("setupStaticRoutes");

        if (app.config.env !== "production" && app.config.env !== "staging") {
          let staticDir = path.join(STATICS_ROOT, "site");
          console.log("staticDir", staticDir);
          app.use("/public", express.static(staticDir));
          let faviconImage = path.join(staticDir, "images", "favicon.ico");
          if (fs.existsSync(faviconImage)) {
            let favicon = require("serve-favicon");
            app.use(favicon(faviconImage));
          }
        }

        resolve();
      });
    }

    function configureMiddleware() {
      return new Promise((resolve, reject) => {
        debug("configureMiddleware");

        let bodyParser = require("body-parser");
        app.use(bodyParser.json());

        // For Isomorphic React
        app.use(function prepareResData(req, res, next) {
          if (!res.locals.data) {
            res.locals.data = {};
          }
          next();
        });

        if (app.config.authentication.adapters.length) {
          let AuthenticationMiddleware = require(path.join(SOURCE_PATH, "lib", "Middleware", "Authentication"));
          let amInstance = new AuthenticationMiddleware(app, config.authentication);
          app.authentication = amInstance.register();
        }

        let tasks = [];

        tasks.push(
          require(path.join(SOURCE_PATH, "lib", "Middleware", "Security")).configure(app, app.config.security)
        );

        if (app.config.cdn.adapter.length) {
          tasks.push(
            require(path.join(SOURCE_PATH, "lib", "Middleware", "CDN")).configure(app, app.config.cdn)
          );
        }

        return Promise.all(tasks)
          .then(() => resolve())
          .catch((err) => reject(err));
      });
    }

    function setupExtensions() {
      let tasks = [];
      debug("setupExtensions");

      let extensionsDir = path.join(SOURCE_PATH, "extensions");
      if (fs.existsSync(extensionsDir)) {
        Helpers.listDirSync(extensionsDir)
        .forEach((extensionName) => {
          tasks.push(
            new Promise((resolve, reject) => {
              debug(`Loading extension ${extensionName}`);

              return require(path.join(extensionsDir, extensionName)).register(app)
                .then( () => resolve() )
                .catch( (err) => reject(err) );
            })
          );
        });
      }

      return Promise.all(tasks);
    }

    function setupRoutes() {
      return new Promise((resolve, reject) => {
        debug("setupRoutes");

        var routerFiles = Helpers.walkDirSync(path.join(SOURCE_PATH, "/routes"), {
          ext: [".js"]
        });

        routerFiles.forEach((rf) => {
          var router;
          try {
            router = require(rf);
          } catch(err) {
            app.log.error("Unable to load router " + rf + ": " + err.message);
            if (app.config.env === "development") {
              app.log.error(err.stack);
            }
            return reject(err);
          }

          try {
            router.registerRoutes(app);
          } catch (err) {
            app.log.error("Unable to register routes from router " + rf + ": " + err.message);
            if (app.config.env === "development") {
              app.log.error(err.stack);
            }
            return reject(err);
          }
        });

        // For Isomorphic React
        app.get("*", function populateCommonData(req, res, next) {
          debug("populateCommonData");
          if (!res.locals.data) {
            res.locals.data = {};
          }
          next();
        });

        // For Isomorphic React
        app.use(function mainRoute(req, res) {
          debug("mainRoute");
          if (!res.locals.data.ApplicationStore) {
            res.locals.data.ApplicationStore = {};
          }
          //res.locals.data.ApplicationStore.csrf = req.csrfToken();

          debug("res.locals.data", res.locals.data);

          alt.bootstrap(JSON.stringify(res.locals.data || {}));

          var iso = new Iso();

          Router.run(routes, req.url, function (Handler) {
            var content = React.renderToString(React.createElement(Handler));
            iso.add(content, alt.flush());

            if (!res.locals.styleSheets) {
              res.locals.styleSheets = [];
            }

            var html = iso.render();
            res.render("layout", {
              html: html,
              env: app.config.env,
              styleSheet: res.locals.styleSheets
            });
          });
        });

        app.use(function errorHandler(err, req, res) {
          var code = 422;
          if (err.statusCode) {
            code = err.statusCode;
          }
          var msg = "Unexpected error has occurred!";
          if (err.message) {
            msg = err.message;
          }
          var payload = msg;

          var asJSON = false;
          if (req.xhr || req.headers["content-type"] === "application/json") {
            asJSON = true;
          }

          if (asJSON) {
            payload = {
              status: "failed", error: msg, data: {
                name: err.name
              }
            };

            if (err.stack && app.config.env === "development") {
              payload.data.stack = err.stack;
            }

            if (err instanceof Errors.BaseError) {
              var errors = err.data && err.data.errors;
              if (errors) {
                var fields = {};
                Object.keys(errors).forEach(function (field) {
                  fields[field] = {
                    message: errors[field]
                  };
                });
                payload.data.fields = fields;
              }
            }
            else if (err.message.match(/Duplicate primary key/)) {
              payload.error = err.message.split("\n")[0];
              payload.error = payload.error.substr(0, payload.error.length - 1);
            }
            else if (err.name === "ValidationError") {
              if (err.errors) {
                payload.data.fields = {};
                Object.keys(err.errors).forEach(function (field) {
                  payload.data.fields[field] = {
                    message: err.errors[field].message,
                    path: err.errors[field].path,
                    type: err.errors[field].type
                  };
                });
              }
            }
          }

          if (err.stack && app.config.env === "development") {
            debug("Error stacktrace: ", err.stack);
          }

          if (!app.config.errors.includeData) {
            delete payload.data;
          }

          res.status(code).send(payload);
        });

        resolve();
      });
    }

    function additionalConfig() {
      return new Promise((resolve) => {
        debug("additionalConfig");

        app.locals.site = {
          title: "Homehapp"
        };

        resolve();
      });
    }

    // Application initialization flow

    configureLogger()
    .then( () => connectToDatabase() )
    .then( () => setupStaticRoutes() )
    .then( () => configureMiddleware() )
    .then( () => setupExtensions() )
    .then( () => setupRoutes() )
    .then( () => additionalConfig() )
    .then( () => {
      debug("Application initialization flow done!");

      if (app.config.env !== "test") {
        app.server.listen(app.config.port, function() {
          app.log.info(`Server listening on port: ${app.config.port}`);
        });
      } else {
        afterRun(app);
      }
    })
    .catch(err => {
      app.log.error(`Error on initialization flow!: ${err.message}`, err, {stack: err.stack});
      // console.error("Error on initialization flow", err);
      // console.error(err.stack);
      throw err;
    });

  });

};

if (require.main === module) {
  exports.run();
}
