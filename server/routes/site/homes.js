import QueryBuilder from '../../lib/QueryBuilder';
import { setLastMod, initMetadata } from '../../../clients/common/Helpers';
let debug = require('debug')('/homes');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/home', function(req, res) {
    debug('Redirecting the GUI call to deprecated /home');
    return res.redirect(301, '/homes');
  });

  app.get('/home/:slug', function(req, res) {
    debug('Redirecting the GUI call to deprecated /home/:slug');
    return res.redirect(301, `/homes/${req.params.slug}`);
  });

  let listHomes = (req, res) => {
    let query = {};

    if (req.params.type) {
      query.announcementType = req.params.type;
    }
    if (req.params.story) {
      query['story.enabled'] = true;
    }

    return new Promise((resolve, reject) => {
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
        debug(`Got ${result.models.length} homes`);
        initMetadata(res);
        res.locals.data.HomeListStore = {
          homes: result.models
        };
        setLastMod(result.models, res);
        resolve(result.models);
      })
      .catch((err) => {
        reject(err);
      });
    });
  };

  app.get('/homes', function(req, res, next) {
    debug('GET /homes');

    listHomes(req, res, next)
    .then(() => {
      res.locals.page = {
        title: 'Homes',
        description: 'Our exclusive homes'
      };
      next();
    })
    .catch(next);
  });

  // app.get('/homes/:story(stories)', function(req, res, next) {
  //   debug('GET /homes/stories');
  //
  //   listHomes(req, res, next)
  //   .then(() => {
  //     res.locals.page = {
  //       title: 'Storified homes',
  //       description: 'Our storified homes'
  //     };
  //     next();
  //   })
  //   .catch(next);
  // });

  app.get('/search', function(req, res, next) {
    debug('GET /search');

    listHomes(req, res, next)
    .then(() => {
      res.locals.page = {
        title: 'Homes',
        description: 'Our exclusive homes'
      };
      next();
    })
    .catch(next);
  });

  app.get('/search/:type', function(req, res, next) {
    debug(`GET /search/${req.params.type}`);
    let types = ['buy', 'rent', 'story'];
    let titles = {
      buy: 'Homes for sale',
      rent: 'Homes for rent',
      story: 'Our storified homes'
    };

    if (types.indexOf(req.params.type) === -1) {
      return next();
    }

    listHomes(req, res, next)
    .then(() => {
      res.locals.page = {
        title: titles[req.params.type],
        description: titles[req.params.type]
      };
      next();
    })
    .catch(next);
  });

  let populateCity = (home) => {
    if (!home.location.neighborhood || !home.location.neighborhood.location || !home.location.neighborhood.location.city) {
      debug('No city defined');
      return new Promise().resolve();
    }
    debug('City defined');

    return new Promise((resolve, reject) => {
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

  let returnHomeBySlug = (req, res, next) => {
    let home = null;
    let neighborhood = null;
    let slug = req.params.slug;

    QB
    .forModel('Home')
    .populate({
      'location.neighborhood': {},
      agents: {}
    })
    .findBySlug(req.params.slug)
    .fetch()
    .then((result) => {
      home = result.home;
      if (home.location.neighborhood) {
        neighborhood = home.location.neighborhood;
      }

      res.locals.data.title = [home.homeTitle];
      let images = [];
      if (home.images) {
        for (let i = 0; i < home.images.length; i++) {
          let src = home.images[i].url || home.images[i].src;
          if (src) {
            images.push(src.replace(/upload\//, 'upload/c_fill,h_526,w_1000/g_south_west,l_homehapp-logo-horizontal-with-shadow,x_20,y_20/'));
          }
        }
      }
      initMetadata(res);

      let title = [home.homeTitle];
      let description = home.description || title.join('; ');

      if (description.length > 200) {
        description = description.substr(0, 200) + '…';
      }

      res.locals.openGraph['og:image'] = images.concat(res.locals.openGraph['og:image']);
      res.locals.page = {
        title: title.join(' | '),
        description: description
      };

      setLastMod([home, neighborhood], res);
      populateCity(home)
      .then((home) => {
        res.locals.data.HomeStore = {
          home: home
        };
        next();
      });
    })
    .catch(() => {
      debug('Home not found by slug, try if the identifier was its UUID', slug);
      QB
      .forModel('Home')
      .findByUuid(slug)
      .fetch()
      .then((result) => {
        let regexp = new RegExp(req.params.slug.replace(/\-/, '\\-'));
        let href = req.url.replace(regexp, result.model.slug);
        debug('Redirecting the UUID based call to slug based URL', href);
        return res.redirect(301, href);
      })
      .catch(() => {
        res.status(404);
        next();
      });
    })
    .catch(() => {
      res.status(404);
      next();
    });
  };

  app.get('/homes/:slug', function(req, res, next) {
    debug(`GET /homes/${req.params.slug}`);
    returnHomeBySlug(req, res, next);
  });

  app.get('/homes/:slug/details', function(req, res, next) {
    debug(`GET /homes/${req.params.slug}/details`);
    returnHomeBySlug(req, res, next);
  });
  app.get('/homes/:slug/story', function(req, res, next) {
    debug(`GET /homes/${req.params.slug}/story`);
    returnHomeBySlug(req, res, next);
  });
};
