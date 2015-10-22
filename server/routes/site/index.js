import QueryBuilder from '../../lib/QueryBuilder';
let debug = require('debug')('/');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  // Remove the trailing slash as React
  app.get('*/', function(req, res, next) {
    debug('GET *', req.url);
    if (!req.url.match(/^\/($|\?)/) && req.url.match(/\/($|\?)/)) {
      let url = req.url.replace(/\/($|\?)/, '$1');
      return res.redirect(301, url);
    }
    next();
  });

  app.get('/', function(req, res, next) {
    debug('GET /');
    QB
    .forModel('Home')
    .parseRequestArguments(req)
    .populate({
      'location.neighborhood': {}
    })
    .findAll()
    .fetch()
    .then((result) => {
      debug(`Got ${result.models.length} homes`);
      res.locals.data.HomeListStore = {
        homes: result.models
      };
      res.locals.page = {
        title: 'Discover y',
        description: 'Homehapp - discover y'
      };
      next();
    });
  });
};
