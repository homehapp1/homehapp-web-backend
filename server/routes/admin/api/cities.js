import QueryBuilder from '../../../lib/QueryBuilder';
//import {/*NotImplemented, */BadRequest} from '../../../lib/Errors';
let debug = require('debug')('/api/cities');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  let populate = {
    createdBy: {},
    updatedBy: {}
  };

  app.get('/api/cities', app.authenticatedRoute, function(req, res, next) {
    QB
    .forModel('City')
    .parseRequestArguments(req)
    .populate(populate)
    .findAll()
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        cities: result.models.map((city) => {
          return city.toJSON();
        })
      });
    })
    .catch(next);
  });

  app.post('/api/cities', app.authenticatedRoute, function(req, res, next) {
    debug('API update city with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.city;

    if (req.user) {
      data.createdBy = req.user.id;
      data.updatedBy = req.user.id;
    }

    QB
    .forModel('City')
    .populate(populate)
    .createNoMultiset(data)
    .then((model) => {
      res.json({
        status: 'ok',
        city: model
      });
    })
    .catch(next);
  });


  app.get('/api/cities/:uuid', app.authenticatedRoute, function(req, res, next) {
    debug('API fetch city with uuid', req.params.uuid);

    QB
    .forModel('City')
    .populate(populate)
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        city: result.model
      });
    })
    .catch(next);

  });

  let updateCity = function updateCity(uuid, data) {
    debug('Update city with data', data);
    return QB
    .forModel('City')
    .findByUuid(uuid)
    .updateNoMultiset(data);
  };

  app.put('/api/cities/:uuid', app.authenticatedRoute, function(req, res, next) {
    debug('API update city with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.city;

    if (req.user) {
      data.updatedBy = req.user.id;
    }

    updateCity(req.params.uuid, data)
    .then((model) => {
      res.json({
        status: 'ok',
        city: model
      });
    })
    .catch(next);
  });

  app.delete('/api/cities/:uuid', app.authenticatedRoute, function(req, res, next) {
    QB
    .forModel('City')
    .findByUuid(req.params.uuid)
    .remove()
    .then((result) => {
      res.json({
        status: 'deleted',
        city: result.model
      });
    })
    .catch(next);
  });
};
