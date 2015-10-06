'use strict';

import QueryBuilder from '../../lib/QueryBuilder';
import { setLastMod } from '../../../clients/common/Helpers';
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
        setLastMod([neighborhood, city].concat(neighborhood.homes), res);
        resolve(neighborhood);
      })
      .catch(next);
    });
  };

  app.get('/neighborhoods', function(req, res, next) {
    if (typeof res.locals.openGraph === 'undefined') {
      res.locals.openGraph = {
        'og:image': []
      };
    }

    res.locals.openGraph['og:url'] = '/neighborhoods/london';
    next();
  });

  app.get('/neighborhoods/:city', function(req, res, next) {
    let city = null;
    let neighborhoods = [];
    debug(`/neighborhoods/${req.params.city}`);

    QB
    .forModel('City')
    .findBySlug(req.params.city)
    .fetch()
    .then((result) => {
      city = result.city;

      // Get each neighborhood ID that is populated with homes
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
      let images = [];
      neighborhoods = result.models;
      for (let neighborhood of neighborhoods) {
        neighborhood.location.city = city;
        let image = neighborhood.mainImage.url;
        if (images.indexOf(image) === -1) {
          images.push(image);
        }
      }

      if (typeof res.locals.openGraph === 'undefined') {
        res.locals.openGraph = {
          'og:image': []
        };
      }
      res.locals.openGraph['og:image'] = images.concat(res.locals.openGraph['og:image']);

      res.locals.page = {
        title: `Neighborhoods of ${city.title}`,
        description: `Neighborhoods of ${city.title}`
      };
      setLastMod(neighborhoods, res);

      res.locals.data.NeighborhoodListStore = {
        neighborhoods: neighborhoods
      };
      next();
    })
    .catch(next);
  });

  app.get('/neighborhoods/:city/:neighborhood', function(req, res, next) {
    debug(`/neighborhoods/${req.params.city}/${req.params.neighborhood}`);
    getNeighborhoodBySlug(req, res, next)
    .then((neighborhood) => {
      debug('Got neighborhood', neighborhood);
      res.locals.data.title = neighborhood.pageTitle;

      let description = neighborhood.description || `View the neighborhood of ${neighborhood.title}, ${neighborhood.location.city.title}`;

      if (description.length > 200) {
        description = description.substr(0, 200) + '…';
      }

      res.locals.page = {
        title: neighborhood.pageTitle,
        description: description
      };
      next();
    })
    .catch(next);
  });

  app.get('/neighborhoods/:city/:neighborhood/homes', function(req, res, next) {
    getNeighborhoodBySlug(req, res, next)
    .then((neighborhood) => {
      debug('Got neighborhood', neighborhood);
      res.locals.data.title = [`Homes in ${neighborhood.title}`];
      let description = `View our exclusive homes in ${neighborhood.title}, ${neighborhood.location.city.title}`;
      res.locals.page = {
        title: res.locals.data.title.join(' | '),
        description: description
      };
      debug('callback finished');
      next();
    })
    .catch(next);
  });
};
