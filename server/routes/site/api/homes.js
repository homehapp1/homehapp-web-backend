'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/api/home/:slug', function(req, res, next) {
    QB
    .forModel('Home')
    .findBySlug(req.params.slug)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok', home: result.home
      });
    })
    .catch(next);

  });

  app.get('/api/home', function(req, res, next) {
    QB
    .forModel('Home')
    .parseRequestArguments(req)
    .findAll()
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok', homes: result.homes
      });
    })
    .catch(next);

  });

};
