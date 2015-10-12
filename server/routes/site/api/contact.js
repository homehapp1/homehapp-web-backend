'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';
import {/*NotImplemented, */BadRequest} from '../../../lib/Errors';
let debug = require('debug')('/api/contact');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);
  app.post('/api/contacts', function(req, res, next) {
    debug('Create a new contact request', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.contact;

    if (req.user) {
      data.createdBy = req.user.id;
      data.updatedBy = req.user.id;
    }

    QB
    .forModel('Contact')
    .create(data)
    .then((model) => {
      res.json({
        status: 'ok',
        contact: model
      });
    })
    .catch(next);
  });
};
