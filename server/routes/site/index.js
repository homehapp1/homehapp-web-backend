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

  app.get('/partners', function(req, res, next) {
    res.locals.page = {
      title: 'Become our partner',
      description: 'Become our partner'
    };
    next();
  });
  app.get('/careers', function(req, res, next) {
    res.locals.page = {
      title: 'Careers',
      description: 'Want to make yourself a career with the aid of Homehapp?'
    };
    next();
  });
  app.get('/about', function(req, res, next) {
    res.locals.page = {
      title: 'About us',
      description: 'Homes that make people happy'
    };
    next();
  });
  app.get('/terms', function(req, res, next) {
    res.locals.page = {
      title: 'Terms and conditions',
      description: 'Terms and conditions for using the services of Homehapp'
    };
    next();
  });
  app.get('/privacy', function(req, res, next) {
    res.locals.page = {
      title: 'Privacy policy',
      description: 'We value your right for privacy. Read about our policies on how we use any data and how we keep you safe.'
    };
    next();
  });
};
