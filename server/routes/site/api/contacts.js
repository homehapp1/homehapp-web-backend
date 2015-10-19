

import QueryBuilder from '../../../lib/QueryBuilder';
// import {NotImplemented, BadRequest} from '../../../lib/Errors';
let debug = require('debug')('/api/contact');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);
  let createContact = function createContact(res, data) {
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
  };

  app.post('/api/contacts', function(req, res, next) {
    debug('Create a new contact request');
    //debug('req.body', req.body);

    let data = req.body.contact;

    if (req.user) {
      data.createdBy = req.user.id;
      data.updatedBy = req.user.id;
    }

    if (data.home) {
      QB
      .forModel('Home')
      .findByUuid(data.home)
      .fetch()
      .then((result) => {
        data.home = result.model;
        debug('Link the contact request to home', result.model.homeTitle);
        createContact(res, data);
      })
      .catch(next);
    } else {
      createContact(res, data);
    }
  });
};
