'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';
let debug = require('debug')('app');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);
  app.get('/api/neighborhoods/:city', function(req, res, next) {
    let city = null;

    QB
    .forModel('City')
    .findBySlug(req.params.city)
    .fetch()
    .then((result) => {
      city = result.city;
      return QB
      .forModel('Home')
      .distinct('location.neighborhood')
      .fetch();
    })
    .then((result) => {
      return QB
      .forModel('Neighborhood')
      .query({
        _id: {
          $in: result.models
        },
        'location.city': city
      })
      .findAll()
      .fetch();
    })
    .then((result) => {
      res.json({
        status: 'ok',
        neighborhoods: result.models
      });
    })
    .catch(next);
  });

  app.get('/api/neighborhoods/:city/:neighborhood', function(req, res, next) {
    let city = null;
    let neighborhood = null;

    QB
    .forModel('City')
    .findBySlug(req.params.city)
    .fetch()
    .then((result) => {
      city = result.city;
      return QB
      .forModel('Neighborhood')
      .query({
        // 'location.city': city,
        slug: req.params.neighborhood
      })
      .findAll()
      .fetch();
    })
    .then((result) => {
      if (result.models.length !== 1) {
        throw new Error('Neighborhood not found');
      }

      neighborhood = result.models[0];
      neighborhood.location.city = city;

      return QB
      .forModel('Home')
      .findByNeighborhood(neighborhood)
      .fetch();
    })
    .then((result) => {
      neighborhood.homes = result.models;
      res.json({
        status: 'ok',
        neighborhood: neighborhood
      });
    })
    .catch(next);
  });

  app.get('/api/neighborhoods/:city/:neighborhood/homes', function(req, res, next) {
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
