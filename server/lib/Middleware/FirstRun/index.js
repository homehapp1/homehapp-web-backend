

import basicAuth from 'basic-auth-connect';
import fs from 'fs';
import path from 'path';
//let debug = require('debug')('FirstRunMiddleware');

exports.configure = function(app, config = {}) {
  if (!config.enabled) {
    return Promise.resolve();
  }

  let firstRunFlagPath = path.join(app.PROJECT_ROOT, '.firstrun');

  app.firstRun = {
    routePath: config.path,
    firstRunFlagPath: firstRunFlagPath,
    isDone: () => {
      return new Promise((resolve) => {
        if (fs.existsSync(firstRunFlagPath)) {
          return resolve(true);
        }
        resolve(false);
      });
    },
    markAsDone: () => {
      fs.writeFileSync(firstRunFlagPath, '1');
    }
  };

  app.use((req, res, next) => {
    if (!req.path.match(new RegExp(`^${config.path}`))) {
      app.firstRun.isDone()
      .then((status) => {
        if (!status) {
          return res.redirect(config.path);
        }
        next();
      }).catch(next);
    } else {
      next();
    }
  });

  app.route(config.path)
    .all(basicAuth(config.username, config.password))
    .get((req, res, next) => {
      app.firstRun.isDone()
      .then((status) => {
        if (status) {
          return res.redirect('/');
        }

        app.getLocals(req, res, {
          includeClient: false,
          bodyClass: 'adminFirstRun',
          csrfToken: req.csrfToken(),
          firstRunPath: config.path
        })
        .then((locals) => {
          res.render('firstrun', locals);
        });
      }).catch(next);
    });

  return Promise.resolve();
};
