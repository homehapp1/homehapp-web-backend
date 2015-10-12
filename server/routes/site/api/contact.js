'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';
import {/*NotImplemented, */BadRequest} from '../../../lib/Errors';
let debug = require('debug')('/api/contact');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);
  app.post('/api/contact', function(req, res, next) {
    debug('Create a new contact request', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.contact;

    if (!data.recipient) {
      return next(new BadRequest('invalid request body'));
    }

    if (req.user) {
      data.createdBy = req.user.id;
      data.updatedBy = req.user.id;
    }

    QB
    .forModel('Home')
    .populate(populate)
    .create(data)
    .then((model) => {
      res.json({
        status: 'ok',
        home: model
      });
    })
    .catch(next);
  });
};
