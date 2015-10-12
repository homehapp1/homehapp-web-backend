'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';
import {/*NotImplemented,*/ BadRequest} from '../../../lib/Errors';
let debug = require('debug')('/api/contacts');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/api/contacts', function(req, res, next) {
    debug('API fetch contacts');
    debug('req.query', req.query);

    QB
    .forModel('Contact')
    .parseRequestArguments(req)
    .findAll()
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        contacts: result.models
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
    if (!data.email) {
      throw new Error('Missing email address');
    }
    if (!data.phone) {
      throw new Error('Missing phone number');
    }
  };

  app.post('/api/contacts', function(req, res, next) {
    debug('API update contact with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.contact;
    try {
      validateInput(data);
    } catch (error) {
      debug('Validate failed', error);
      return next(new BadRequest(error.message));
    }

    QB
    .forModel('Contact')
    .createNoMultiset(data)
    .then((model) => {
      res.json({
        status: 'ok',
        contact: model
      });
    })
    .catch((error) => {
      debug('Create failed', error);
      return next(new BadRequest(error.message));
    });
  });


  app.get('/api/contacts/:uuid', function(req, res, next) {
    debug('API fetch contact with uuid', req.params.uuid);
    debug('req.query', req.query);

    if (req.params.uuid === 'blank') {
      debug('Create a blank contact');
      let model = new (QB.forModel('Contact')).Model();
      debug('created a blank', model);
      res.json({
        status: 'ok',
        contact: model
      });
      return null;
    }

    QB
    .forModel('Contact')
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok', contact: result.contact
      });
    })
    .catch(next);

  });

  let updateContact = function updateContact(uuid, data) {
    debug('Data', data);

    return QB
    .forModel('Contact')
    .findByUuid(uuid)
    .updateNoMultiset(data);
  };

  app.put('/api/contacts/:uuid', function(req, res, next) {
    debug('API update contact with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.contact;

    try {
      validateInput(data);
    } catch (error) {
      return next(new BadRequest(error.message));
    }

    updateContact(req.params.uuid, data)
    .then((model) => {
      res.json({
        status: 'ok', contact: model
      });
    })
    .catch(next);
  });

  // app.patch('/api/contacts/:uuid', function(req, res, next) {
  //   debug('API update contact with uuid', req.params.uuid);
  //   //debug('req.body', req.body);
  //
  //   let data = req.body.contact;
  //
  //   updateContact(req.params.uuid, data)
  //   .then((model) => {
  //     res.json({
  //       status: 'ok', contact: model
  //     });
  //   })
  //   .catch(next);
  // });
  app.delete('/api/contacts/:uuid', function(req, res, next) {
    QB
    .forModel('Contact')
    .findByUuid(req.params.uuid)
    .remove()
    .then((result) => {
      res.json({
        status: 'deleted',
        contact: result.model
      });
    })
    .catch(next);
  });
};
