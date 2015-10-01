'use strict';

import QueryBuilder from '../../lib/QueryBuilder';
// let debug = require('debug')('neighborhoods API');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);
  let returnNeighborhoodBySlug = (city, slug, res, next) => {
    QB
    .forModel('Neighborhood')
    .findByCity(city)
    .findBySlug(slug)
    .fetch()
    .then((result) => {
      res.locals.data.title = [result.neighborhood.title];
      let images = [];
      if (result.neighborhood.images) {
        for (let i = 0; i < result.neighborhood.images.length; i++) {
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

      let title = [result.neighborhood.title];
      let description = result.neighborhood.description || title.join('; ');

      if (description.length > 200) {
        description = description.substr(0, 200) + '…';
      }

      res.locals.openGraph['og:image'] = images.concat(res.locals.openGraph['og:image']);
      res.locals.openGraph['og:updated_time'] = result.home.updatedAt.toISOString();
      res.locals.page = {
        title: title.join(' | '),
        description: description
      };

      res.locals.metadatas.push({
        'http-equiv': 'last-modified',
        'content': res.locals.openGraph['og:updated_time']
      });

      res.locals.data.NeighborhoodStore = {
        home: result.homeJson
      };
      next();
    })
    .catch(next);
  };

  let getHomeCount = (neighborhood) => {
    return QB
    .forModel('Home')
    .query({
      'location.neighborhood': neighborhood.id,
      deletedAt: null
    })
    .count()
    .then((res) => {
      // console.log('got result', res, 'for getHomeCount');
      resolve(1);
    });
  };

  app.get('/neighborhoods/:city', function(req, res, next) {
    let city = null;
    neighborhoods = [];

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

  app.get('/neighborhoods/:city/:slug', function(req, res, next) {
    returnNeighborhoodBySlug(req, res, next);
  });
  app.get('/neighborhoods/:city/:slug/homes', function(req, res, next) {
    returnNeighborhoodBySlug(req, res, next);
  });
};
