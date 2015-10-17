'use strict';

import QueryBuilder from '../../lib/QueryBuilder';
import {BadRequest} from '../../lib/Errors';
import fs from 'fs';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  if (app.firstRun) {
    app.firstRun.isDone = () => {
      return new Promise((resolve, reject) => {
        if (fs.existsSync(app.firstRun.firstRunFlagPath)) {
          return resolve(true);
        }

        QB
        .forModel('User')
        .query({
          _accessLevel: 'admin'
        })
        .findAll()
        .count()
        .then((count) => {
          if (count) {
            app.firstRun.markAsDone();
            return resolve(true);
          }
          resolve(false);
        })
        .catch(reject);
      });
    };
  }

  app.post(app.firstRun.routePath, (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      return next(new BadRequest('invalid request params'));
    }

    let data = {
      givenName: req.body.givenName,
      familyName: req.body.familyName,
      username: req.body.username,
      password: req.body.password,
      _accessLevel: 'admin',
      active: true
    };

    QB
    .forModel('User')
    .createNoMultiset(data)
    .then((result) => {
      if (!result.model) {
        return res.redirect(app.firstRun.routePath);
      }

      app.firstRun.markAsDone();
      let redirectTo = '/';
      if (req.body.redirectTo) {
        redirectTo = req.body.redirectTo;
      }
      res.redirect(redirectTo);
    })
    .catch(next);
  });
};
