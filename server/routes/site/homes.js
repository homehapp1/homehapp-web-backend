'use strict';

import QueryBuilder from '../../lib/QueryBuilder';
let debug = require('debug')('app');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  let returnHomeBySlug = (slug, res, next) => {
    QB
    .forModel('Home')
    .findBySlug(slug)
    .fetch()
    .then((result) => {
      debug('res', result.home);
      res.locals.data.title = [result.home.homeTitle];
      res.locals.metadatas = [
        {
          property: 'foo',
          value: 'bar'
        }
      ];
      let images = [];

      if (result.home.images) {
        for (let i = 0; i < result.home.images.length; i++) {
          let src = result.home.images[i].url || result.home.images[i].src;
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

      let title = [result.home.homeTitle];

      if (result.home.location.neighborhood) {
        title.push(result.home.location.neighborhood.title);
      }

      if (result.home.location.address.city) {
        title.push(result.home.location.address.city);
      }

      let description = result.home.description || title.join('; ');

      if (description.length > 200) {
        description = description.substr(0, 200) + '…';
      }

      res.locals.openGraph['og:image'] = images.concat(res.locals.openGraph['og:image']);
      res.locals.page = {
        title: title.join(' | '),
        description: description
      };
      res.locals.metadatas.push({name: 'description', content: description});

      res.locals.data.HomeStore = {
        home: result.homeJson
      };
      next();
    })
    .catch(next);
  };

  app.get('/home/:slug', function(req, res, next) {
    console.log('req.params', req.params);
    returnHomeBySlug(req.params.slug, res, next);
  });

  app.get('/home/:slug/details', function(req, res, next) {
    returnHomeBySlug(req.params.slug, res, next);
  });

};
