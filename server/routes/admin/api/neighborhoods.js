'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';
import {NotImplemented, BadRequest} from '../../../lib/Errors';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/api/neighborhoods', function(req, res, next) {
    console.log('API fetch neighborhoods');
    console.log('req.query', req.query);

    QB
    .forModel('Neighborhood')
    .parseRequestArguments(req)
    .findAll()
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok', neighborhoods: result.neighborhoods
      });
    })
    .catch(next);

  });

  app.get('/api/neighborhoods/:uuid', function(req, res, next) {
    console.log('API fetch neighborhood with uuid', req.params.uuid);
    console.log('req.query', req.query);

    QB
    .forModel('Neighborhood')
    .findByUUID(req.params.uuid)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok', neighborhood: result.neighborhood
      });
    })
    .catch(next);

  });

  app.put('/api/neighborhoods/:uuid', function(req, res, next) {
    console.log('API update neighborhood with uuid', req.params.uuid);
    //console.log('req.body', req.body);

    let data = req.body.neighborhood;

    if (!data.description) {
      return next(new BadRequest('invalid request body'));
    }

    QB
    .forModel('Neighborhood')
    .findByUuid(req.params.uuid)
    .update(data)
    .then((model) => {
      res.json({
        status: 'ok', neighborhood: model
      });
    })
    .catch(next);
  });

};
