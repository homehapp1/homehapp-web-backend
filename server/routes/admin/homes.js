'use strict';

import QueryBuilder from '../../lib/QueryBuilder';
let debug = require('debug')('/homes');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/homes', app.authenticatedRoute, function(req, res, next) {
    return next();
  });

  app.get('/homes/create', app.authenticatedRoute, function(req, res, next) {
    return next();
  });

  let redirectBySlug = function redirectBySlug(req, res, next) {
    QB
    .forModel('Home')
    .findBySlug(req.params.slug)
    .fetch()
    .then((result) => {
      let regexp = new RegExp(req.params.slug.replace(/\-/, '\\-'));
      let href = req.url.replace(regexp, result.model.uuid);
      debug('Redirecting the slug based call to UUID based URL', href);
      res.writeHead(301, {
        Location: href
      });
      res.end();
    })
    .catch(() => {
      // Home not found by slug, do not redirect
      next();
    });
  };

  app.get('/homes/:slug', app.authenticatedRoute, function(req, res, next) {
    redirectBySlug(req, res, next);
  });
  app.get('/homes/:slug/:action', app.authenticatedRoute, function(req, res, next) {
    redirectBySlug(req, res, next);
  });

};
