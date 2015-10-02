'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';
import {NotImplemented, BadRequest} from '../../../lib/Errors';
let debug = require('debug')('/api/homes');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/api/homes', function(req, res, next) {
    debug('API fetch homes');
    debug('req.query', req.query);

    QB
    .forModel('Home')
    .parseRequestArguments(req)
    .findAll()
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        homes: result.models
      });
    })
    .catch(next);
  });

  app.post('/api/homes', function(req, res, next) {
    debug('API update home with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.home;

    if (!data.description) {
      return next(new BadRequest('invalid request body'));
    }

    QB
    .forModel('Home')
    .createNoMultiset(data)
    .then((model) => {
      res.json({
        status: 'ok', home: model
      });
    })
    .catch(next);
  });


  app.get('/api/homes/:uuid', function(req, res, next) {
    debug('API fetch home with uuid', req.params.uuid);
    debug('req.query', req.query);

    if (req.params.uuid === 'blank') {
      debug('Create a blank home');
      let model = new (QB.forModel('Home')).Model();
      debug('created a blank', model);
      res.json({
        status: 'ok',
        home: model
      });
      return null;
    }

    QB
    .forModel('Home')
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok', home: result.home
      });
    })
    .catch(next);

  });

  app.put('/api/homes/:uuid', function(req, res, next) {
    debug('API update home with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.home;

    if (!data.description) {
      return next(new BadRequest('invalid request body'));
    }

    QB
    .forModel('Home')
    .findByUuid(req.params.uuid)
    .updateNoMultiset(data)
    .then((model) => {
      res.json({
        status: 'ok', home: model
      });
    })
    .catch(next);
  });

};
