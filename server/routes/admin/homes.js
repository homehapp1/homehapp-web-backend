'use strict';

import QueryBuilder from '../../lib/QueryBuilder';
let debug = require('debug')('/homes');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/homes', function(req, res, next) {
    return next();
  });

  app.get('/homes/create', function(req, res, next) {
    return next();
  });

  app.get('/homes/:slug', function(req, res, next) {
    QB
    .forModel('Home')
    .findBySlug(req.params.slug)
    .fetch()
    .then((result) => {
      debug('Redirecting the slug based call to UUID based URL');
      res.writeHead(301, {
        Location: `/homes/${result.model.uuid}`
      });
      res.end();
    })
    .catch(() => {
      // Home not found by slug, do not redirect
      next();
    });
  });

};
