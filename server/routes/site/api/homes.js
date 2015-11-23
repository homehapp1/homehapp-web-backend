import QueryBuilder from '../../../lib/QueryBuilder';
let debug = require('debug')('/api/homes');
let url = require('url');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  let populateCity = (home) => {
    if (!home.location.neighborhood || !home.location.neighborhood.location || !home.location.neighborhood.location.city) {
      debug('No city defined');
      return Promise.resolve(home);
    }
    debug('City defined');

    return new Promise((resolve) => {
      QB
      .forModel('City')
      .findById(home.location.neighborhood.location.city)
      .fetch()
      .then((result) => {
        debug('City available', result.model);
        home.location.neighborhood.location.city = result.model;
        resolve(home);
      })
      .catch((err) => {
        // Do not populate city if it was not found from the database
        debug('City not available', err);
        home.location.neighborhood.location.city = null;
        resolve(home);
      });
    });
  };

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
      'location.neighborhood': {},
      agents: {}
    })
    .findBySlug(req.params.slug)
    .fetch()
    .then((result) => {
      debug('Home fetched', result);
      populateCity(result.home)
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
    let query = {};
    for (let k in parts.query) {
      let v = parts.query[k];
      switch (k) {
        case 'type':
          query.announcementType = v;
          break;
        case 'story':
          query['story.enabled'] = (Number(v)) ? true : false;
          break;
      }
    }

    debug('Query', query);

    QB
    .forModel('Home')
    .parseRequestArguments(req)
    .query(query)
    .populate({
      'location.neighborhood': {}
    })
    .sort({
      'metadata.score': -1
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
