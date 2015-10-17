

import QueryBuilder from '../../../lib/QueryBuilder';
let debug = require('debug')('/api/homes');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/api/home', function(req, res) {
    debug('Redirecting the API call to deprecated /api/home');
    res.writeHead(301, {
      Location: `/api/homes`
    });
    res.end();
  });

  app.get('/api/home/:slug', function(req, res) {
    debug('Redirecting the API call to deprecated /api/home/:slug');
    res.writeHead(301, {
      Location: `/api/homes/${req.params.slug}`
    });
    res.end();
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
