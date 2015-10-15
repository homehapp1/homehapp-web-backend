'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';
import {/*NotImplemented, */BadRequest} from '../../../lib/Errors';
let debug = require('debug')('/api/users');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  let populate = {
    createdBy: {},
    updatedBy: {}
  };

  app.get('/api/users', app.authenticatedRoute, function(req, res, next) {
    debug('API fetch users');
    debug('req.user', req.user);

    QB
    .forModel('User')
    .parseRequestArguments(req)
    .populate(populate)
    .findAll()
    .fetch()
    .then((result) => {
      debug('/api/users');
      debug(result.models);
      res.json({
        status: 'ok',
        users: result.models.map((user) => {
          return user.toJSON();
        })
      });
    })
    .catch(next);
  });

  app.post('/api/users', app.authenticatedRoute, function(req, res, next) {
    debug('API update user with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.user;

    if (!data.username) {
      return next(new BadRequest('invalid request body'));
    }

    if (req.user) {
      data.createdBy = req.user.id;
      data.updatedBy = req.user.id;
    }

    function createUser() {
      return QB
      .forModel('User')
      .populate(populate)
      .createNoMultiset(data)
      .then((model) => {
        res.json({
          status: 'ok',
          user: model
        });
      })
      .catch(next);
    }
    createUser(data);
  });


  app.get('/api/users/:uuid', app.authenticatedRoute, function(req, res, next) {
    debug('API fetch user with uuid', req.params.uuid);
    debug('req.query', req.query);

    QB
    .forModel('User')
    .populate(populate)
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        user: result.user
      });
    })
    .catch(next);

  });

  let updateUser = function updateUser(uuid, data) {
    debug('Data', data);

    QB
    .forModel('User')
    .findByUuid(uuid)
    .updateNoMultiset(data)
    .then((model) => {
      debug('Updated', model);
      resolve(model);
    })
    .catch((err) => {
      debug('Failed', err);
    });
  };

  app.put('/api/users/:uuid', app.authenticatedRoute, function(req, res, next) {
    debug('API update user with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.user;

    if (req.user) {
      data.updatedBy = req.user.id;
    }

    updateUser(req.params.uuid, data)
    .then((model) => {
      res.json({
        status: 'ok',
        user: model
      });
    })
    .catch(next);
  });

  // app.patch('/api/users/:uuid', function(req, res, next) {
  //   debug('API update user with uuid', req.params.uuid);
  //   //debug('req.body', req.body);
  //
  //   let data = req.body.user;
  //
  //   updateUser(req.params.uuid, data)
  //   .then((model) => {
  //     res.json({
  //       status: 'ok', user: model
  //     });
  //   })
  //   .catch(next);
  // });

  app.delete('/api/users/:uuid', app.authenticatedRoute, function(req, res, next) {
    QB
    .forModel('User')
    .findByUuid(req.params.uuid)
    .remove()
    .then((result) => {
      res.json({
        status: 'deleted',
        user: result.model
      });
    })
    .catch(next);
  });
};
