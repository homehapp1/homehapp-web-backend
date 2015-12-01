import QueryBuilder from '../../lib/QueryBuilder';
import NeighborhoodsAPI from '../../api/NeighborhoodsAPI';
import { setLastMod, initMetadata } from '../../../clients/common/Helpers';
let debug = require('debug')('neighborhoods API');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);
  let api = new NeighborhoodsAPI(app, QB);

  app.get('/neighborhoods', function(req, res, next) {
    QB
    .forModel('City')
    .findAll()
    .fetch()
    .then((result) => {
      if (result.models.length === 1) {
        debug('Found only one city', result.models[0]);
        return res.redirect(301, `/neighborhoods/${result.models[0].slug}`);
      }
      res.locals.data.CityListStore = {
        cities: result.models
      };
    })
    .catch(next);
  });

  app.get('/neighborhoods/:city', function(req, res, next) {
    debug(`/neighborhoods/${req.params.city}`);
    api.listNeighborhoodsByCity(req, res, next)
    .then((neighborhoods) => {
      let images = [];
      let city = null;
      for (let neighborhood of neighborhoods) {
        let image = neighborhood.mainImage.url;
        if (images.indexOf(image) === -1) {
          images.push(image);
        }
        if (neighborhood.location && neighborhood.location.city) {
          city = neighborhood.location.city;
        }
      }
      initMetadata(res);
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
    api.getNeighborhoodBySlug(req, res, next)
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
      res.locals.data.NeighborhoodStore = {
        neighborhood: neighborhood
      };
      next();
    })
    .catch((err) => {
      res.status(404);
      next();
    });
  });

  app.get('/neighborhoods/:city/:neighborhood/homes', function(req, res, next) {
    api.getNeighborhoodBySlug(req, res, next)
    .then((neighborhood) => {
      debug('Got neighborhood', neighborhood);
      res.locals.data.NeighborhoodStore = {
        neighborhood: neighborhood
      };

      // Common metadata for all the single neighborhood views
      let images = [];
      if (neighborhood && neighborhood.images) {
        for (let image of neighborhood.images) {
          let src = image.url || image.src;
          if (src) {
            images.push(src.replace(/upload\//, 'upload/c_fill,h_526,w_1000/g_south_west,l_homehapp-logo-horizontal-with-shadow,x_20,y_20/v1441911573/'));
          }
        }
      }
      let city = neighborhood.location.city;

      initMetadata(res);
      res.locals.openGraph['og:image'] = images.concat(res.locals.openGraph['og:image']);
      setLastMod([neighborhood, city].concat(neighborhood.homes), res);

      res.locals.data.title = [`Homes in ${neighborhood.title}`];
      let description = `View our exclusive homes in ${neighborhood.title}, ${city.title}`;
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
