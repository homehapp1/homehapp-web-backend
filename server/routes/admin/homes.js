'use strict';

import QueryBuilder from '../../lib/QueryBuilder';
let debug = require('debug')('/homes');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/homes', function(req, res, next) {
    debug('fetch homes');
    debug('req.query', req.query);

    QB
    .forModel('Home')
    .parseRequestArguments(req)
    .findAll()
    .fetch()
    .then((result) => {
      res.locals.data.HomeListStore = {
        homes: result.homesJson
      };
      next();
    })
    .catch(next);

  });

  app.get('/homes/create', function(req, res, next) {
    debug('Create a blank home');
    let model = new (QB.forModel('Home')).Model();
    debug('Created a blank', model);
    res.locals.data.HomeListStore = {
      homes: [model.toJSON()]
    };
    next();
  });

  let getHomeByUuid = function getHomeByUuid(req, res, next) {
    debug('Fetch home by uuid', req.params.uuid);
    let home = null;

    QB
    .forModel('Home')
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {
      home = result.home;

      return QB
      .forModel('Neighborhood')
      .findById(home.location.neighborhood)
      .fetch();
    })
    .then((result) => {
      home.location.neighborhood = result.model;
      res.locals.data.HomeListStore = {
        homes: [home.toJSON()]
      };
      next();
    })
    .catch(() => {
      if (home) {
        res.locals.data.HomeListStore = {
          homes: [home.toJSON()]
        };
      }
      next();
    });
  };

  app.get('/homes/delete/:uuid', function(req, res, next) {
    getHomeByUuid(req, res, next);
  });

  app.get('/homes/edit/:uuid', function(req, res, next) {
    getHomeByUuid(req, res, next);
  });

};
