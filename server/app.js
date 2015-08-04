'use strict';

import path from 'path';
import fs from 'fs';
import http from 'http';

import express from 'express';

// For Isomorphic React
import React from 'react';
import Router from 'react-router';
import Iso from 'iso';

import Configuration from './lib/Configuration';
import Helpers from './lib/Helpers';
import Errors from './lib/Errors';
import Logger from './lib/Logger';

let PROJECT_NAME = 'site';
const PROJECT_ROOT = path.resolve(__dirname, '..');
const COMMON_CLIENT_ROOT = path.resolve(PROJECT_ROOT, 'clients', 'common');
const STATICS_ROOT = path.resolve(PROJECT_ROOT, 'build', 'statics');
const SOURCE_PATH = __dirname;
let CLIENT_ROOT = null;

let debug = require('debug')('app');

exports.run = function(projectName, afterRun) {

  PROJECT_NAME = projectName || 'site';
  CLIENT_ROOT = path.resolve(PROJECT_ROOT, 'clients', PROJECT_NAME);

  if (typeof afterRun !== 'function') {
    afterRun = () => {};
  }

  Configuration.load(PROJECT_ROOT, PROJECT_NAME, path.join(PROJECT_ROOT, 'config'), {}, function (configError, config) {
    if (configError) {
      throw configError;
    }

    process.env.DEBUG = process.env.DEBUG || true;
    if (config.env === 'production') {
      process.env.DEBUG = false;
    }

    let app = module.exports.app = express();
    app.config = config;
    app.server = http.createServer(app);
    app.PROJECT_NAME = PROJECT_NAME;
    app.PROJECT_ROOT = PROJECT_ROOT;
    app.SOURCE_PATH = SOURCE_PATH;

    app.set('trust proxy', 1);

    /**
     * Configure templating if views folder is present
     */

    let viewsFolder = path.join(PROJECT_ROOT, 'views', PROJECT_NAME);
    if (config.isomorphic.enabled) {
      viewsFolder = path.join(CLIENT_ROOT, 'templates');
    }

    if (fs.existsSync(viewsFolder)) {
      let ejs = require('ejs');

      app.set('view engine', 'html');
      app.set('views', viewsFolder);
      app.engine('html', ejs.renderFile);

      let partials = require('express-partials');
      partials.register('.html', ejs.render);
      app.use(partials());

      if (!config.isomorphic.enabled) {
        app.use(require('express-layout')());
      }
    }

    function configureLogger() {
      return new Promise((resolve) => {
        debug('configureLogger');
        let logger = new Logger(config.logging);

        // Add external logging transports here
        // ie. logger.addTransport('Loggly', require('winston-loggly').Loggly);
        logger.configure(app).then(() => resolve());
      });
    }

    function connectToDatabase() {
      return new Promise((resolve, reject) => {
        debug('connectToDatabase');
        if (!app.config.database.adapter) {
          debug('no database adapter configured');
          return resolve();
        }
        require(path.join(SOURCE_PATH, 'lib', 'Database')).configure(app, app.config.database)
        .then( () => resolve() )
        .catch((err) => {
          app.log.error(`Unable to configure database!: ${err.message}`, err);
          reject(err);
        });
      });
    }

    function setupStaticRoutes() {
      return new Promise((resolve) => {
        debug('setupStaticRoutes');

        if (app.config.env !== 'production' && app.config.env !== 'staging') {
          let staticDir = path.join(STATICS_ROOT, app.PROJECT_NAME);
          app.use('/public', express.static(staticDir));

          let faviconImage = path.join(staticDir, 'images', 'favicon.ico');
          if (fs.existsSync(faviconImage)) {
            let favicon = require('serve-favicon');
            app.use(favicon(faviconImage));
          }
        }

        resolve();
      });
    }

    function configureMiddleware() {
      return new Promise((resolve, reject) => {
        debug('configureMiddleware');

        let bodyParser = require('body-parser');
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        if (config.isomorphic.enabled) {
          app.use(function prepareResData(req, res, next) {
            if (!res.locals.data) {
              res.locals.data = {};
            }
            next();
          });
        }

        if (app.config.authentication && app.config.authentication.adapters.length) {
          let AuthenticationMiddleware = require(path.join(SOURCE_PATH, 'lib', 'Middleware', 'Authentication'));
          let amInstance = new AuthenticationMiddleware(app, config.authentication);
          app.authentication = amInstance.register();
        }

        let tasks = [];

        tasks.push(
          require(path.join(SOURCE_PATH, 'lib', 'Middleware', 'Security')).configure(app, app.config.security)
        );

        if (app.config.cdn.adapter.length) {
          tasks.push(
            require(path.join(SOURCE_PATH, 'lib', 'Middleware', 'CDN')).configure(app, app.config.cdn)
          );
        }

        return Promise.all(tasks)
          .then(() => resolve())
          .catch((err) => reject(err));
      });
    }

    function setupExtensions() {
      let tasks = [];
      debug('setupExtensions');

      let extensionsDir = path.join(SOURCE_PATH, 'extensions');
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
        debug('setupRoutes');

        let routerFiles = Helpers.walkDirSync(path.join(SOURCE_PATH, '/routes/common'), {
          ext: ['.js']
        });
        let projectRoutesPath = path.join(SOURCE_PATH, '/routes', app.PROJECT_NAME);
        if (require('fs').existsSync(projectRoutesPath)) {
          var projectRouterFiles = Helpers.walkDirSync(projectRoutesPath, {
            ext: ['.js']
          });
          routerFiles = routerFiles.concat(projectRouterFiles);
        }

        routerFiles.forEach((rf) => {
          let router;
          try {
            router = require(rf);
          } catch(err) {
            app.log.error('Unable to load router ' + rf + ': ' + err.message);
            if (app.config.env === 'development') {
              app.log.error(err.stack);
            }
            return reject(err);
          }

          try {
            router.registerRoutes(app);
          } catch (err) {
            app.log.error('Unable to register routes from router ' + rf + ': ' + err.message);
            if (app.config.env === 'development') {
              app.log.error(err.stack);
            }
            return reject(err);
          }
        });

        if (config.isomorphic.enabled) {
          app.get('*', function populateCommonData(req, res, next) {
            debug('populateCommonData');
            if (!res.locals.data) {
              res.locals.data = {};
            }
            next();
          });
        }

        if (config.isomorphic.enabled) {
          app.use(function mainRoute(req, res, next) {
            debug('mainRoute');
            if (req.skipMain) {
              return next();
            }

            let alt = require(path.join(COMMON_CLIENT_ROOT, 'alt.js'));

            if (!res.locals.data.ApplicationStore) {
              res.locals.data.ApplicationStore = {};
            }

            if (app.config.security.csrf) {
              res.locals.data.ApplicationStore.csrf = req.csrfToken();
            }

            res.locals.data.ApplicationStore.config = {
              cloudinary: {
                baseUrl: '//res.cloudinary.com/kaktus/image/upload/',
                transformations: {
                  // Pinterest styled card
                  card: 'c_fill,q_60,w_400',

                  // Big image view
                  large: 'c_scale,q_60,w_1920',
                  medium: 'c_scale,q_60,w_1000',
                  small: 'c_scale,q_60,w_600'
                }
              }
            };

            debug('res.locals.data', res.locals.data);

            alt.bootstrap(JSON.stringify(res.locals.data || {}));

            var iso = new Iso();

            let routes = require(path.join(CLIENT_ROOT, 'components/Routes'));

            Router.run(routes, req.url, function (Handler) {
              var content = React.renderToString(React.createElement(Handler));
              iso.add(content, alt.flush());

              if (!res.locals.styleSheets) {
                res.locals.styleSheets = [];
              }

              var html = iso.render();
              app.getLocals(req, res, {
                html: html,
                includeClient: true
              })
              .then((locals) => {
                res.render('index', locals);
              });
            });
          });
        }

        app.use(function errorHandler(err, req, res) {
          var code = err.statusCode || 422;
          var msg = err.message || 'Unexpected error has occurred!';
          var payload = msg;
          var isJSONRequest = (req.xhr || req.headers['content-type'] === 'application/json');

          if (err.code === 'EBADCSRFTOKEN') {
            code = 403;
            msg = 'Request was tampered!';
          }

          let handleUnauthenticatedGetRequest = function() {
            if ([403].indexOf(code) !== -1) {
              if (app.authenticationRoutes) {
                let redirectUrl = `${app.authenticationRoutes.login}?message=${msg}`;
                return res.redirect(redirectUrl);
              }
            }
          };

          if (!isJSONRequest) {
            handleUnauthenticatedGetRequest();
          }

          let prepareJSONError = function() {
            payload = {
              status: 'failed', error: msg, data: {
                name: err.name
              }
            };

            if (err.stack && app.config.env === 'development') {
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
              payload.error = err.message.split('\n')[0];
              payload.error = payload.error.substr(0, payload.error.length - 1);
            }
            else if (err.name === 'ValidationError') {
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
          };

          if (isJSONRequest) {
            payload = prepareJSONError();
          }

          // if (err.stack && app.config.env === 'development') {
          //   debug('Error stacktrace: ', err.stack);
          // }

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
        debug('additionalConfig');

        let pageTitle = 'Homehapp';
        if (projectName === 'admin') {
          pageTitle = 'Homehapp - Admin';
        }
        app.locals.site = {
          title: pageTitle
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
      debug('Application initialization flow done!');

      if (app.config.env !== 'test') {
        app.server.listen(app.config.port, function() {
          app.log.info(`Server listening on port: ${app.config.port}`);
          afterRun(app);
        });
      } else {
        afterRun(app);
      }
    })
    .catch(err => {
      app.log.error(`Error on initialization flow!: ${err.message}`, err, {stack: err.stack});
      // console.error('Error on initialization flow', err);
      // console.error(err.stack);
      throw err;
    });

  });

};

if (require.main === module) {
  exports.run();
}
