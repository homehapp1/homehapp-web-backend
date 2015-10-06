'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';
let debug = require('debug')('/api/homes');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  let getNeighborhood = function getNeighborhood(id) {
    return QB
    .forModel('Neighborhood')
    .findById(id)
    .fetch();
  };

  app.get('/api/home/:slug', function(req, res, next) {
    let home = null;
    QB
    .forModel('Home')
    .findBySlug(req.params.slug)
    .fetch()
    .then((result) => {
      debug('Home fetched', result.home.title);
      home = result.home;
      return getNeighborhood(home.location.neighborhood);
    })
    .then((result) => {
      debug('neighborhood received', result.model);
      home.location.neighborhood = result.model;
      res.json({
        status: 'ok',
        home: home
      });
    })
    .catch(next);
  });

  app.get('/api/home', function(req, res, next) {
    QB
    .forModel('Home')
    .parseRequestArguments(req)
    .populate({
      'location.neighborhood': {}
    })
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

};
