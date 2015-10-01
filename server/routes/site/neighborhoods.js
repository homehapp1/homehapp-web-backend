'use strict';

import QueryBuilder from '../../lib/QueryBuilder';
let debug = require('debug')('neighborhoods API');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);
  let getNeighborhoodBySlug = (req, res, next) => {
    let city = null;
    let neighborhood = null;

    return new Promise((resolve, reject) => {
      QB
      .forModel('City')
      .findBySlug(req.params.city)
      .fetch()
      .then((result) => {
        debug('Got city', result.model.title);
        city = result.model;
        debug('Search for neighborhood', req.params.neighborhood);

        return QB
        .forModel('Neighborhood')
        .findBySlug(req.params.neighborhood)
        .fetch();
      })
      .then((result) => {
        debug('Got neighborhood', result.model.title);
        neighborhood = result.model;
        neighborhood.location.city = city;

        return QB
        .forModel('Home')
        .findByNeighborhood(neighborhood)
        .fetch();
      })
      .then((result) => {
        debug('Got neighborhood homes', result.models.length);
        neighborhood.homes = result.models;

        res.locals.data.NeighborhoodStore = {
          neighborhood: neighborhood
        };

        // Common metadata for all the single neighborhood views
        let images = [];
        if (neighborhood.images) {
          for (let i = 0; i < neighborhood.images.length; i++) {
            let src = result.neighborhood.images[i].url || result.neighborhood.images[i].src;
            if (src) {
              images.push(src.replace(/upload\//, 'upload/c_fill,h_526,w_1000/g_south_west,l_homehapp-logo-horizontal-with-shadow,x_20,y_20/v1441911573/'));
            }
          }
        }

        if (typeof res.locals.openGraph === 'undefined') {
          res.locals.openGraph = {
            'og:image': []
          };
        }

        if (typeof res.locals.metadatas === 'undefined') {
          res.locals.metadatas = [];
        }

        res.locals.openGraph['og:image'] = images.concat(res.locals.openGraph['og:image']);
        res.locals.openGraph['og:updated_time'] = neighborhood.updatedAt.toISOString();

        resolve(neighborhood);
      })
      .catch(next);
    });
  };

  app.get('/neighborhoods/:city', function(req, res, next) {
    let city = null;
    let neighborhoods = [];

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
      neighborhoods = result.models;
      for (let neighborhood of neighborhoods) {
        neighborhood.location.city = city;
      }
      res.locals.data.NeighborhoodListStore = {
        neighborhoods: neighborhoods
      };
      next();
    })
    .catch(next);
  });

  app.get('/neighborhoods/:city/:neighborhood', function(req, res, next) {
    getNeighborhoodBySlug(req, res, next)
    .then((neighborhood) => {
      debug('returnNeighborhoodBySlug callback', neighborhood.title);
      res.locals.data.title = [neighborhood.title];

      let title = [neighborhood.title];
      let description = neighborhood.description || title.join('; ');

      if (description.length > 200) {
        description = description.substr(0, 200) + '…';
      }

      res.locals.page = {
        title: title.join(' | '),
        description: description
      };
      debug('callback finished');
      next();
    })
    .catch(next);
  });
  app.get('/neighborhoods/:city/:neighborhood/homes', function(req, res, next) {
    getNeighborhoodBySlug(req, res, next);
  });
};
