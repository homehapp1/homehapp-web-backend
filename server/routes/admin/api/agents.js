'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';
import {BadRequest} from '../../../lib/Errors';
let debug = require('debug')('/api/agents');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  let updateAgent = function updateAgent(uuid, data) {
    debug('Data', data);

    return QB
    .forModel('Agent')
    .findByUuid(uuid)
    .updateNoMultiset(data);
  };

  let prepareAgentModelForReturn = function prepareAgentModelForReturn(model) {
    let agent = model.toJSON();
    agent.realPhoneNumber = model._realPhoneNumber;
    agent.realPhoneNumberType = model._realPhoneNumberType;
    return agent;
  };

  app.get('/api/agents', app.authenticatedRoute, function(req, res, next) {
    debug('API fetch agents');
    debug('req.query', req.query);

    QB
    .forModel('Agent')
    .parseRequestArguments(req)
    .findAll()
    .fetch()
    .then((result) => {
      let agents = result.models.map((model) => {
        return prepareAgentModelForReturn(model);
      });
      res.json({
        status: 'ok',
        items: agents
      });
    })
    .catch(next);
  });

  let validateInput = function validateInput(data) {
    if (!data.firstname) {
      throw new Error('Missing firstname');
    }
    if (!data.lastname) {
      throw new Error('Missing lastname');
    }
    // if (!data.email) {
    //   throw new Error('Missing email address');
    // }
    // if (!data.phone) {
    //   throw new Error('Missing phone number');
    // }
    return true;
  };

  app.post('/api/agents', app.authenticatedRoute, function(req, res, next) {
    debug('API update agent with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.agent;

    try {
      validateInput(data);
    } catch (error) {
      debug('Validate failed', error);
      return next(new BadRequest(error.message));
    }

    QB
    .forModel('Agent')
    .createNoMultiset(data)
    .then((model) => {
      if (model._realPhoneNumber && !model.contactNumber) {
        app.twilio.registerNumberForAgent(model)
        .then((results) => {
          let updateData = {
            contactNumber: results.phoneNumber,
            _contactNumberSid: results.sid
          };
          updateAgent(model.uuid, updateData)
          .then((updModel) => {
            res.json({
              status: 'ok', agent: prepareAgentModelForReturn(updModel)
            });
          })
          .catch(next);
        })
        .catch(next);
      } else {
        res.json({
          status: 'ok', agent: model
        });
      }
    })
    .catch((error) => {
      debug('Create failed', error);
      return next(new BadRequest(error.message));
    });
  });


  app.get('/api/agents/:uuid', app.authenticatedRoute, function(req, res, next) {
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
        status: 'ok', agent: prepareAgentModelForReturn(result.model)
      });
    })
    .catch(next);

  });

  app.put('/api/agents/:uuid', app.authenticatedRoute, function(req, res, next) {
    debug('API update agent with uuid', req.params.uuid);
    debug('req.body', req.body);

    let data = req.body.agent;

    try {
      validateInput(data);
    } catch (error) {
      return next(new BadRequest(error.message));
    }

    updateAgent(req.params.uuid, data)
    .then((model) => {
      if (model._realPhoneNumber && !model.contactNumber) {
        app.twilio.registerNumberForAgent(model)
        .then((results) => {
          let updateData = {
            contactNumber: results.phoneNumber,
            _contactNumberSid: results.sid
          };
          updateAgent(model.uuid, updateData)
          .then((updModel) => {
            res.json({
              status: 'ok', agent: prepareAgentModelForReturn(updModel)
            });
          })
          .catch(next);
        })
        .catch(next);
      } else {
        res.json({
          status: 'ok', agent: model
        });
      }
    })
    .catch(next);
  });

  // app.patch('/api/agents/:uuid', app.authenticatedRoute, function(req, res, next) {
  //   debug('API update agent with uuid', req.params.uuid);
  //   //debug('req.body', req.body);
  //
  //   let data = req.body.agent;
  //
  //   updateAgent(req.params.uuid, data)
  //   .then((model) => {
  //     res.json({
  //       status: 'ok', agent: model
  //     });
  //   })
  //   .catch(next);
  // });
  app.delete('/api/agents/:uuid', app.authenticatedRoute, function(req, res, next) {
    QB
    .forModel('Agent')
    .findByUuid(req.params.uuid)
    .remove()
    .then((result) => {
      res.json({
        status: 'ok'
      });
    })
    .catch(next);
  });

  app.delete('/api/agents/:uuid/contactnumber', app.authenticatedRoute, function(req, res, next) {
    QB
    .forModel('Agent')
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {
      app.twilio.unregisterNumberForAgent(result.model)
      .then((removeResults) => {
        debug('removeResults', removeResults);
        QB
        .forModel('Agent')
        .findByUuid(req.params.uuid)
        .updateNoMultiset({
          contactNumber: '',
          _contactNumberSid: null
        })
        .then((model) => {
          res.json({
            status: 'ok', agent: prepareAgentModelForReturn(model)
          });
        })
        .catch(next);
      })
      .catch(next);
    })
    .catch(next);
  });
};
