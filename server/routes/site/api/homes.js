import QueryBuilder from '../../../lib/QueryBuilder';
let debug = require('debug')('/api/homes');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/api/home', function(req, res) {
    debug('Redirecting the API call to deprecated /api/home');
    return res.redirect(301, '/api/homes');
  });

  app.get('/api/home/:slug', function(req, res) {
    debug('Redirecting the API call to deprecated /api/home/:slug');
    return res.redirect(301, `/api/homes/${req.params.slug}`);
  });

  app.get('/api/homes/:slug', function(req, res, next) {
    QB
    .forModel('Home')
    .populate({
      'location.neighborhood': {}
    })
    .findBySlug(req.params.slug)
    .fetch()
    .then((result) => {
      debug('Home fetched', result);
      res.json({
        status: 'ok',
        home: result.home
      });
    })
    .catch(next);
  });

  app.get('/api/homes', function(req, res, next) {
    QB
    .forModel('Home')
    .parseRequestArguments(req)
    .populate({
      'location.neighborhood': {}
    })
    .findAll()
    .fetch()
    .then((result) => {
      app.log.debug(`/api/homes Got ${result.models.length} homes`);
      res.json({
        status: 'ok',
        homes: result.models
      });
    })
    .catch(next);
  });

};
