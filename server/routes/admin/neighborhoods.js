'use strict';

import QueryBuilder from '../../lib/QueryBuilder';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/neighborhoods', function(req, res, next) {
    console.log('fetch neighborhoods');
    console.log('req.query', req.query);

    QB
    .forModel('Neighborhood')
    .parseRequestArguments(req)
    .findAll()
    .fetch()
    .then((result) => {
      res.locals.data.NeighborhoodListStore = {
        neighborhoods: result.neighborhoodsJson
      };
      next();
    })
    .catch(next);

  });

  app.get('/neighborhoods/edit/:uuid', function(req, res, next) {
    console.log('fetch neighborhood by uuid', req.params.uuid);
    console.log('req.query', req.query);

    QB
    .forModel('Neighborhood')
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {
      res.locals.data.NeighborhoodListStore = {
        neighborhoods: [result.neighborhoodJson]
      };
      next();
    })
    .catch(next);

  });

};
