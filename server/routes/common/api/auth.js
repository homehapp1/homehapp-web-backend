'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/api/auth/user', function(req, res, next) {
    QB
    .query('User')
    .findById(req.user.id)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok', user: result.userJson
      });
    })
    .catch(next);
  });

};
