import csrf from 'csurf';
import {Forbidden} from '../../Errors';
import {enumerate} from '../../Helpers';

exports.configure = function(app, config) {
  return new Promise((resolve) => {
    if (config.csrf) {
      let csrfProtection = csrf({});
      if (!app.authentication || !app.hasSessions) {
        csrfProtection = csrf({
          cookie: true
        });
        app.use(require('cookie-parser')());
      }
      if (config.csrfSkipRoutes && config.csrfSkipRoutes.length) {
        app.use(function csrfSkipRoutes(req, res, next) {
          let matched = false;
          config.csrfSkipRoutes.forEach((skipPath) => {
            if (req.path.match(skipPath)) {
              matched = true;
            }
          });
          if (matched) {
            req.csrfToken = () => {
              return '';
            };
            return next();
          }
          csrfProtection(req, res, next);
        });
      } else {
        app.use(csrfProtection);
      }
    }

    if (config.xframe && config.xframe.length) {
      if (['DENY', 'SAMEORIGIN'].indexOf(config.xframe) === -1
        && !config.xframe.match(/ALLOW\-FROM /))
      {
        console.warn(`Configured X-Frame-Options value ${config.xframe} is not allowed. Skipping.`);
      } else {
        app.use(function xFrameProtection(req, res, next) {
          res.header('X_FRAME_OPTIONS', config.xframe);
          next();
        });
      }
    }

    if (config.requiredHeaders && Object.keys(config.requiredHeaders).length) {
      app.use(function requiredHeaders(req, res, next) {
        let reason = null;

        // Skip favicon requests
        if (req.path.substr(1).match(/^favicon/)) {
          return next();
        }

        if (config.requiredHeaders.allowRoutes) {
          let skipCheck = false;
          let requestPath = req.path.substr(1);
          config.requiredHeaders.allowRoutes.forEach((pathRegexp) => {
            if (requestPath.match(pathRegexp)) {
              skipCheck = true;
            }
          });

          if (skipCheck) {
            return next();
          }
        }

        if (config.requiredHeaders.exists) {
          config.requiredHeaders.exists.forEach((key) => {
            if (!req.headers[key.toLowerCase()]) {
              reason = `Missing required header: ${key}`;
            }
          });
        }

        if (config.requiredHeaders.valueMatch) {
          for (let [key, value] of enumerate(config.requiredHeaders.valueMatch)) {
            if (!req.headers[key.toLowerCase()]) {
              reason = `Missing required header: ${key}`;
            }
            if (req.headers[key.toLowerCase()] !== value) {
              reason = `Invalid value for header: ${key}`;
            }
          }
        }

        if (reason) {
          app.log.info(`API client request denied. Reason: ${reason}`);
          return next(new Forbidden('invalid request'));
        }
        //  else {
        //   app.log.info('API client request accepted');
        // }

        next();
      });
    }

    if (config.cors && config.cors.enabled) {
      app.all('*', function(req, res, next) {
        // CORS headers
        res.header('Access-Control-Allow-Origin', config.cors.allowOrigin);
        res.header(
          'Access-Control-Allow-Methods',
          'HEAD,GET,PUT,POST,DELETE,OPTIONS'
        );

        // Set custom headers for CORS
        if (config.cors.allowHeaders && config.cors.allowHeaders.length) {
          res.header(
            'Access-Control-Allow-Headers',
            config.cors.allowHeaders.join(',')
          );
        }

        if (req.method === 'OPTIONS') {
          return res.status(200).end();
        }

        next();
      });
    }

    resolve();
  });
};
