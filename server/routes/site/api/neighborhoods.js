import QueryBuilder from '../../../lib/QueryBuilder';
import NeighborhoodsAPI from '../../../api/NeighborhoodsAPI';
let debug = require('debug')('app');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);
  let api = new NeighborhoodsAPI(app, QB);

  app.get('/api/neighborhoods', function(req, res, next) {
    api.listNeighborhoods(req, res, next)
    .then((neighborhoods) => {
      res.json({
        status: 'ok',
        items: neighborhoods
      });
    })
    .catch(next);
  });

  app.get('/api/neighborhoods/:city', function(req, res, next) {
    api.listNeighborhoodsByCity(req, res, next)
    .then((neighborhoods) => {
      res.json({
        status: 'ok',
        items: neighborhoods
      });
    })
    .catch(next);
  });

  app.get('/api/neighborhoods/:city/:neighborhood', function(req, res, next) {
    api.getNeighborhoodBySlug(req, res, next)
    .then((neighborhood) => {
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
    .parseRequestArguments(req)
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
        .parseRequestArguments(req)
        .sort({
          'metadata.score': -1
        })
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
