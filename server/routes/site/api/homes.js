import QueryBuilder from '../../../lib/QueryBuilder';
import Api from '../../../api/HomesAPI';
let debug = require('debug')('/api/homes');
let url = require('url');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);
  let api = new Api(app, QB);

  app.get('/api/home', function(req, res) {
    debug('Redirecting the API call to deprecated /api/home');
    return res.redirect(301, '/api/homes');
  });

  app.get('/api/home/:slug', function(req, res) {
    debug('Redirecting the API call to deprecated /api/home/:slug');
    return res.redirect(301, `/api/homes/${req.params.slug}`);
  });

  app.get('/api/homes/:slug', function(req, res, next) {
    api.getHome(req, res, next)
    .then((result) => {
      debug('Home fetched', result);
      api.populateCityForHome(result.home)
      .then((home) => {
        res.json({
          status: 'ok',
          home: home
        });
      });
    })
    .catch(next);
  });

  app.get('/api/homes', function(req, res, next) {
    let parts = url.parse(req.url, true);
    api.listHomes(req, res, next)
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
