'use strict';

import QueryBuilder from '../../lib/QueryBuilder';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/home/:slug', function(req, res, next) {
    console.log('show home with slug', req.params.slug);
    console.log('req.query', req.query);

    QB
    .query('Home')
    .findBySlug(req.params.slug)
    .fetch()
    .then((result) => {
      res.locals.data.HomeStore = {
        home: result.homeJson
      };
      next();
    })
    .catch(next);

  });

};
