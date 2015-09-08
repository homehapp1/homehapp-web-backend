'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';
import {NotImplemented, BadRequest} from '../../../lib/Errors';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/api/homes', function(req, res, next) {
    console.log('API fetch homes');
    console.log('req.query', req.query);

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

  app.get('/api/homes/:uuid', function(req, res, next) {
    console.log('API fetch home with uuid', req.params.uuid);
    console.log('req.query', req.query);

    QB
    .forModel('Home')
    .findByUUID(req.params.uuid)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok', home: result.home
      });
    })
    .catch(next);

  });

  app.put('/api/homes/:uuid', function(req, res, next) {
    console.log('API update home with uuid', req.params.uuid);
    //console.log('req.body', req.body);

    let data = req.body.home;

    if (!data.description) {
      return next(new BadRequest('invalid request body'));
    }

    QB
    .forModel('Home')
    .findByUuid(req.params.uuid)
    .update(data)
    .then((model) => {
      res.json({
        status: 'ok', home: model
      });
    })
    .catch(next);
  });

};
