import QueryBuilder from '../../../lib/QueryBuilder';
// import { NotImplemented, BadRequest } from '../../../lib/Errors';
let debug = require('debug')('/api/neighborhoods');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);
  let populate = {
    'location.city': {}
  };

  app.get('/api/neighborhoods/populated', app.authenticatedRoute, function(req, res, next) {
    debug('API fetch populated neighborhoods');
    QB
    .forModel('Home')
    .distinct('location.neighborhood')
    .fetch()
    .then((result) => {
      return QB
      .forModel('Neighborhood')
      .query({
        _id: {
          $in: result.models
        }
      })
      .parseRequestArguments(req)
      .populate(populate)
      .findAll()
      .sort('title')
      .fetch();
    })
    .then((result) => {
      res.json({
        status: 'ok',
        items: result.models
      });
    })
    .catch(next);
  });

  app.get('/api/neighborhoods', app.authenticatedRoute, function(req, res, next) {
    debug('API fetch neighborhoods');
    QB
    .forModel('Neighborhood')
    .parseRequestArguments(req)
    .populate(populate)
    .findAll()
    .sort('title')
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        items: result.models
      });
    })
    .catch(next);
  });

  app.get('/api/neighborhoods/:uuid', app.authenticatedRoute, function(req, res, next) {
    console.log('API fetch neighborhood with uuid', req.params.uuid);
    console.log('req.query', req.query);

    QB
    .forModel('Neighborhood')
    .findByUuid(req.params.uuid)
    .populate(populate)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        item: result.neighborhood
      });
    })
    .catch(next);

  });

  let updateNeighborhood = function updateNeighborhood(req, res, next) {
    let data = req.body.neighborhood;
    debug('data', data);

    return new Promise((resolve, reject) => {
      // Update the neighborhood data after resolving the city
      let update = (neighborhoodData) => {
        QB
        .forModel('Neighborhood')
        .findByUuid(req.params.uuid)
        .populate(populate)
        .update(neighborhoodData)
        .then((model) => {
          resolve(model);
        })
        .catch((next) => {
          reject(next);
        });
      };

      // Skip city updating
      if (!data.location || typeof data.location.city === 'undefined') {
        return update(data);
      }

      if (!data.location.city) {
        data.location.city = null;
      }

      // Get the city by UUID or fail and allow setting null value
      QB.forModel('City')
      .findByUuid(data.location.city)
      .fetch()
      .then((result) => {
        data.location.city = result.model;
        update(data);
      })
      .catch(() => {
        data.location.city = null;
        update(data);
      });
    });
  };

  app.put('/api/neighborhoods/:uuid', app.authenticatedRoute, function(req, res, next) {
    debug('API update neighborhood with uuid', req.params.uuid);
    //console.log('req.body', req.body);
    updateNeighborhood(req, res, next)
    .then((model => {
      res.json({
        status: 'ok',
        item: model
      });
    }))
    .catch(next);
  });
};
