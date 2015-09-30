'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';
let debug = require('debug')('app');

exports.registerRoutes = (app) => {
  //let city = null;
  const QB = new QueryBuilder(app);
  app.get('/api/neighborhood/:city', function(req, res, next) {
    QB
    .forModel('City')
    .findBySlug(req.params.city)
    .fetch()
    .then((resultCity) => {
      let city = resultCity.city;
      QB
      .forModel('Neighborhood')
      .findByCity(city)
      .fetch()
      .then((result) => {
        let neighborhoods = [];
        debug('neighborhoods by city', result);
        for (let neighborhood of result.models) {
          if (String(neighborhood.location.city) !== String(city.id)) {
            debug('Neighborhood city mismatch', neighborhood);
            continue;
          }
          neighborhood.location.city = city;
        }

        res.json({
          status: 'ok',
          neighborhoods: result.models
        });
      })
      .catch(next);
    })
    .catch(next);
  });

  app.get('/api/neighborhood/:city/:neighborhood', function(req, res, next) {
    QB
    .forModel('City')
    .findBySlug(req.params.city)
    .fetch()
    .then((resultCity) => {
      let city = resultCity.city;
      QB
      .forModel('Neighborhood')
      .findBySlug(req.params.neighborhood)
      .fetch()
      .then((resultNeighborhood) => {
        debug('Neighborhood by slug', result);
        let neighborhood = resultNeighborhood.models[0];
        if (String(neighborhood.location.city) !== String(city.id)) {
          throw new Error('City mismatch');
        }
        neighborhood.location.city = city;
        res.json({
          status: 'ok',
          neighborhood: neighborhood
        });
      })
      .catch(next);
    })
    .catch(next);
  });

  app.get('/api/neighborhood/:city/:neighborhood/homes', function(req, res, next) {
    QB
    .forModel('City')
    .findBySlug(req.params.city)
    .fetch()
    .then((resultCity) => {
      let city = resultCity.city;
      QB
      .forModel('Neighborhood')
      .findBySlug(req.params.neighborhood)
      .fetch()
      .then((resultNeighborhood) => {
        debug('Neighborhood by slug', resultNeighborhood);
        let neighborhood = resultNeighborhood.models[0];
        if (String(neighborhood.location.city) !== String(city.id)) {
          throw new Error('City mismatch');
        }
        neighborhood.location.city = city;

        QB
        .forModel('Home')
        .findByNeighborhood(neighborhood)
        .fetch()
        .then((resultHome) => {
          let homes = [];
          for (let home of resultHome.models) {
            home.location.neighborhood = neighborhood;
            homes.push(home);
          }
          res.json({
            status: 'ok',
            homes: homes
          });
        })
        .catch(next);
      })
      .catch(next);
    })
    .catch(next);
  });
};
