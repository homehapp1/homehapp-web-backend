'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/api/home', function(req, res, next) {
    console.log('API fetch homes');
    console.log('req.query', req.query);

    QB
    .query('Home')
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

  app.get('/api/home/:uuid', function(req, res, next) {
    console.log('API fetch home with slug', req.params.slug);
    console.log('req.query', req.query);

    QB
    .query('Home')
    .findByUUID(req.params.uuid)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok', home: result.home
      });
    })
    .catch(next);

  });

};
