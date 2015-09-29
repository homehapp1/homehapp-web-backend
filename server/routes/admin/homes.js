'use strict';

import QueryBuilder from '../../lib/QueryBuilder';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/homes', function(req, res, next) {
    console.log('fetch homes');
    console.log('req.query', req.query);

    QB
    .forModel('Home')
    .parseRequestArguments(req)
    .findAll()
    .fetch()
    .then((result) => {
      res.locals.data.HomeListStore = {
        homes: result.homesJson
      };
      next();
    })
    .catch(next);

  });

  app.get('/homes/edit/:uuid', function(req, res, next) {
    console.log('fetch home by uuid', req.params.uuid);
    console.log('req.query', req.query);

    QB
    .forModel('Home')
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {
      res.locals.data.HomeListStore = {
        homes: [result.homeJson]
      };
      next();
    })
    .catch(next);

  });

};
