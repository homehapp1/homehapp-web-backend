import QueryBuilder from '../../../lib/QueryBuilder';
// let debug = require('debug')('/api/pages');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/api/pages/:slug', function(req, res, next) {
    QB
    .forModel('Page')
    .findBySlug(req.params.slug)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        page: result.model
      });
    })
    .catch(next);
  });
};
