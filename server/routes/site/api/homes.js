'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';
let debug = require('debug')('app');

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
    .findAll()
    .fetch()
    .then((result) => {
      let homes = result.models.slice(0);
      let neighborhoods = {};

      let populateNeighborhood = function populateNeighborhood() {
        // All homes successfully populated, return results
        if (!homes.length) {
          res.json({
            status: 'ok',
            homes: result.models
          });
          return null;
        }

        let home = homes[0];
        let id = String(home.location.neighborhood);

        // Neighborhood already fetched, populate with it and move to next
        if (typeof neighborhoods[id] !== 'undefined') {
          home.location.neighborhood = neighborhoods[id];
          homes.shift();
          return populateNeighborhood();
        }
        debug('Neighborhood not found from the list, fetch it');

        getNeighborhood(home.location.neighborhood)
        .then((r) => {
          debug('got neighborhood', r.model.title);
          let _id = String(r.model._id);
          neighborhoods[_id] = r.model;

          // Populate the neighborhood
          populateNeighborhood();
        });
      };
      populateNeighborhood();
    })
    .catch(next);

  });

};
