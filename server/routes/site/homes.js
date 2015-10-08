'use strict';

import QueryBuilder from '../../lib/QueryBuilder';
import { setLastMod } from '../../../clients/common/Helpers';
let debug = require('debug')('/homes');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/home', function(req, res, next) {
    debug('Redirecting the GUI call to deprecated /home');
    res.writeHead(301, {
      Location: `/homes`
    });
    res.end();
  });

  app.get('/home/:slug', function(req, res, next) {
    debug('Redirecting the GUI call to deprecated /home/:slug');
    res.writeHead(301, {
      Location: `/homes/${req.params.slug}`
    });
    res.end();
  });

  let returnHomeBySlug = (req, res, next) => {
    let home = null;
    let neighborhood = null;
    let slug = req.params.slug;

    QB
    .forModel('Home')
    .findBySlug(slug)
    .populate({
      'location.neighborhood': {}
    })
    .fetch()
    .then((result) => {
      home = result.home;
      if (home.location.neighborhood) {
        neighborhood = home.location.neighborhood;
      }

      res.locals.data.title = [home.homeTitle];
      let images = [];
      if (home.images) {
        for (let i = 0; i < home.images.length; i++) {
          let src = home.images[i].url || home.images[i].src;
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

      let title = [home.homeTitle];
      let description = home.description || title.join('; ');

      if (description.length > 200) {
        description = description.substr(0, 200) + '…';
      }

      res.locals.openGraph['og:image'] = images.concat(res.locals.openGraph['og:image']);
      res.locals.page = {
        title: title.join(' | '),
        description: description
      };

      setLastMod([home, neighborhood], res);

      res.locals.data.HomeStore = {
        home: home.toJSON()
      };
      next();
    })
    .catch((err) => {
      debug('Home not found by slug, try if the identifier was its UUID', slug);
      QB
      .forModel('Home')
      .findByUuid(slug)
      .fetch()
      .then((result) => {
        let regexp = new RegExp(req.params.slug.replace(/\-/, '\\-'));
        let href = req.url.replace(regexp, result.model.slug);
        debug('Redirecting the UUID based call to slug based URL', href);
        res.writeHead(301, {
          Location: href
        });
        res.end();
      })
      .catch(next);
    });
  };

  app.get('/homes/:slug', function(req, res, next) {
    debug(`GET /homes/${req.params.slug}`);
    returnHomeBySlug(req, res, next);
  });

  app.get('/homes/:slug/details', function(req, res, next) {
    debug(`GET /homes/${req.params.slug}/details`);
    returnHomeBySlug(req, res, next);
  });
  app.get('/homes/:slug/story', function(req, res, next) {
    debug(`GET /homes/${req.params.slug}/story`);
    returnHomeBySlug(req, res, next);
  });
};
