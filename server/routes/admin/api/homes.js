'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';
import {NotImplemented, BadRequest} from '../../../lib/Errors';
let debug = require('debug')('/api/homes');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/api/homes', function(req, res, next) {
    debug('API fetch homes');
    debug('req.query', req.query);

    QB
    .forModel('Home')
    .parseRequestArguments(req)
    .populate({
      'location.neighborhood': {
        select: 'uuid title slug'
      }
    })
    .findAll()
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        homes: result.models
      });
    })
    .catch(next);
  });

  app.post('/api/homes', function(req, res, next) {
    debug('API update home with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.home;

    if (!data.description) {
      return next(new BadRequest('invalid request body'));
    }

    function createHome(homeData) {
      return QB
      .forModel('Home')
      .populate({
        'location.neighborhood': {
          select: 'uuid title slug'
        }
      })
      .createNoMultiset(data)
      .then((model) => {
        res.json({
          status: 'ok', home: model
        });
      })
      .catch(next);
    }

    if (data.location.neighborhood) {
      let neighborhoodUuid = data.location.neighborhood;
      data.location.neighborhood = null;
      QB
      .forModel('Neighborhood')
      .findByUuid(neighborhoodUuid)
      .fetch()
      .then((result) => {
        debug('Got neighborhood', result.model.title, result.model.id);
        data.location.neighborhood = result.model.id;
        createHome(data);
      })
      .catch((nhError) => {
        app.log.error(`Error fetching Neighborhood: ${err.message}`);
        createHome(data);
      });
    } else {
      createHome(data);
    }
  });


  app.get('/api/homes/:uuid', function(req, res, next) {
    debug('API fetch home with uuid', req.params.uuid);
    debug('req.query', req.query);

    // if (req.params.uuid === 'blank') {
    //   debug('Create a blank home');
    //   let model = new (QB.forModel('Home')).Model();
    //   debug('created a blank', model);
    //   res.json({
    //     status: 'ok',
    //     home: model
    //   });
    //   return null;
    // }

    QB
    .forModel('Home')
    .populate({
      'location.neighborhood': {
        select: 'uuid title slug'
      }
    })
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok', home: result.home
      });
    })
    .catch(next);

  });

  let updateHome = function updateHome(uuid, data) {
    debug('Data', data);

    if (data.location && data.location.neighborhood && String(data.location.neighborhood).match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{8}/)) {
      debug('Get neighborhood', data.location.neighborhood);
      return new Promise((resolve, reject) => {
        QB
        .forModel('Neighborhood')
        .findByUuid(data.location.neighborhood)
        .fetch()
        .then((result) => {
          debug('Got neighborhood', result.model.title, result.model.id);
          data.location.neighborhood = result.model;

          QB
          .forModel('Home')
          .findByUuid(uuid)
          .updateNoMultiset(data)
          .then((model) => {
            debug('Updated', model);
            resolve(model);
          })
          .catch((err) => {
            debug('Failed', err);
          });
        });
      });
    }

    return QB
    .forModel('Home')
    .findByUuid(uuid)
    .updateNoMultiset(data);
  };

  app.put('/api/homes/:uuid', function(req, res, next) {
    debug('API update home with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.home;

    if (!data.description) {
      return next(new BadRequest('invalid request body'));
    }

    updateHome(req.params.uuid, data)
    .then((model) => {
      res.json({
        status: 'ok', home: model
      });
    })
    .catch(next);
  });

  // app.patch('/api/homes/:uuid', function(req, res, next) {
  //   debug('API update home with uuid', req.params.uuid);
  //   //debug('req.body', req.body);
  //
  //   let data = req.body.home;
  //
  //   updateHome(req.params.uuid, data)
  //   .then((model) => {
  //     res.json({
  //       status: 'ok', home: model
  //     });
  //   })
  //   .catch(next);
  // });


};
