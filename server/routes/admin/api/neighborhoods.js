'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';
import {/*NotImplemented,*/ BadRequest} from '../../../lib/Errors';
let debug = require('debug')('/api/neighborhoods');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/api/neighborhoods', function(req, res, next) {
    debug('API fetch neighborhoods');
    debug('req.query', req.query);
    let neighborhoods = [];
    let cities = {};

    QB
    .forModel('Neighborhood')
    .parseRequestArguments(req)
    .findAll()
    .sort('title')
    .fetch()
    .then((result) => {
      neighborhoods = result.models;
      let ids = [];
      for (let neighborhood of neighborhoods) {
        if (ids.indexOf(neighborhood.location.city) !== -1) {
          continue;
        }
        ids.push(neighborhood.location.city);
      }

      return QB
      .forModel('City')
      .query({
        _id: {
          $in: ids
        }
      })
      .findAll()
      .fetch();
    })
    .then((result) => {
      debug(`Got ${result.models.length} cities`);
      for (let city of result.models) {
        cities[city._id] = city;
      }
      for (let neighborhood of neighborhoods) {
        let id = String(neighborhood.location.city);
        if (typeof cities[id] !== 'undefined') {
          neighborhood.location.city = cities[id];
        }
      }
      res.json({
        status: 'ok',
        neighborhoods: neighborhoods
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
        status: 'ok',
        neighborhood: result.neighborhood
      });
    })
    .catch(next);

  });

  app.put('/api/neighborhoods/:uuid', function(req, res, next) {
    console.log('API update neighborhood with uuid', req.params.uuid);
    //console.log('req.body', req.body);

    let data = req.body.neighborhood;

    if (!data.title) {
      return next(new BadRequest('invalid request body'));
    }

    QB
    .forModel('Neighborhood')
    .findByUuid(req.params.uuid)
    .update(data)
    .then((model) => {
      res.json({
        status: 'ok',
        neighborhood: model
      });
    })
    .catch(next);
  });

};
