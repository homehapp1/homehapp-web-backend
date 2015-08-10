'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/api/users', function(req, res, next) {

    QB
    .query('User')
    .parseRequestArguments(req)
    .findAll()
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok', users: result.users
      });
    })
    .catch(next);

  });

  app.get('/api/users/:idOrUsername', function(req, res, next) {

    QB
    .query('User')
    .findByIdOrUsername(req.params.idOrUsername)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok', user: result.user
      });
    })
    .catch(next);

  });

  app.post('/api/users', function(req, res, next) {
    let data = req.body.user;

    QB
    .query('User')
    .create(data, {context: {
      internal: true
    }})
    .then((result) => {
      res.json({
        status: 'ok', user: result
      });
    })
    .catch(next);

  });

};