'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';
import {NotImplemented, BadRequest} from '../../../lib/Errors';
let debug = require('debug')('/api/agents');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/api/agents', function(req, res, next) {
    debug('API fetch agents');
    debug('req.query', req.query);

    QB
    .forModel('Agent')
    .parseRequestArguments(req)
    .findAll()
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        agents: result.models
      });
    })
    .catch(next);
  });

  app.post('/api/agents', function(req, res, next) {
    debug('API update agent with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.agent;

    if (!data.description) {
      return next(new BadRequest('invalid request body'));
    }

    QB
    .forModel('Agent')
    .createNoMultiset(data)
    .then((model) => {
      res.json({
        status: 'ok', agent: model
      });
    })
    .catch(next);
  });


  app.get('/api/agents/:uuid', function(req, res, next) {
    debug('API fetch agent with uuid', req.params.uuid);
    debug('req.query', req.query);

    if (req.params.uuid === 'blank') {
      debug('Create a blank agent');
      let model = new (QB.forModel('Agent')).Model();
      debug('created a blank', model);
      res.json({
        status: 'ok',
        agent: model
      });
      return null;
    }

    QB
    .forModel('Agent')
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok', agent: result.agent
      });
    })
    .catch(next);

  });

  let updateAgent = function updateAgent(uuid, data) {
    debug('Data', data);

    QB
    .forModel('Agent')
    .findByUuid(uuid)
    .updateNoMultiset(data);
  };

  app.put('/api/agents/:uuid', function(req, res, next) {
    debug('API update agent with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.agent;

    if (!data.description) {
      return next(new BadRequest('invalid request body'));
    }

    updateAgent(req.params.uuid, data)
    .then((model) => {
      res.json({
        status: 'ok', agent: model
      });
    })
    .catch(next);
  });

  app.patch('/api/agents/:uuid', function(req, res, next) {
    debug('API update agent with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.agent;

    updateAgent(req.params.uuid, data)
    .then((model) => {
      res.json({
        status: 'ok', agent: model
      });
    })
    .catch(next);
  });
};
