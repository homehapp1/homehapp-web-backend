'use strict';

import QueryBuilder from '../../lib/QueryBuilder';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  let returnHomeBySlug = (slug, res, next) => {
    QB
    .query('Home')
    .findBySlug(slug)
    .fetch()
    .then((result) => {
      res.locals.data.HomeStore = {
        home: result.homeJson
      };
      next();
    })
    .catch(next);
  };

  app.get('/home/:slug', function(req, res, next) {
    returnHomeBySlug(req.params.slug, res, next);
  });

  app.get('/home/:slug/details', function(req, res, next) {
    returnHomeBySlug(req.params.slug, res, next);
  });

};
