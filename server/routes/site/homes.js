import QueryBuilder from '../../lib/QueryBuilder';
import { setLastMod, initMetadata } from '../../../clients/common/Helpers';
import HomesAPI from '../../api/HomesAPI';
let debug = require('debug')('/homes');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);
  let api = new HomesAPI(app, QB);

  app.get('/home', function(req, res) {
    debug('Redirecting the GUI call to deprecated /home');
    return res.redirect(301, '/homes');
  });

  app.get('/home/:slug', function(req, res) {
    debug('Redirecting the GUI call to deprecated /home/:slug');
    return res.redirect(301, `/homes/${req.params.slug}`);
  });

  app.get('/homes', function(req, res, next) {
    debug('GET /homes');

    api.listHomes(req, res, next)
    .then((homes) => {
      initMetadata(res);
      res.locals.page = {
        title: 'Homes',
        description: 'Our exclusive homes'
      };
      res.locals.data.HomeListStore = {
        items: homes
      };
      setLastMod(homes, res);
      next();
    })
    .catch(next);
  });

  app.get('/search', function(req, res, next) {
    debug('GET /search');

    api.listHomes(req, res, next)
    .then((homes) => {
      initMetadata(res);
      res.locals.page = {
        title: 'Homes',
        description: 'Our exclusive homes'
      };
      res.locals.data.HomeListStore = {
        items: homes
      };
      next();
    })
    .catch(next);
  });

  app.get('/search/:type', function(req, res, next) {
    debug(`GET /search/${req.params.type}`);
    let types = ['buy', 'rent', 'story', 'stories'];
    let titles = {
      buy: 'Homes for sale',
      rent: 'Homes for rent',
      story: 'Our storified homes',
      stories: 'Our storified homes'
    };

    if (types.indexOf(req.params.type) === -1) {
      return next();
    }

    api.listHomes(req, res, next)
    .then((homes) => {
      res.locals.page = {
        title: titles[req.params.type],
        description: titles[req.params.type]
      };
      res.locals.data.HomeListStore = {
        items: homes
      };
      next();
    })
    .catch(next);
  });

  let returnHomeBySlug = (req, res, next) => {
    let neighborhood = null;
    let slug = req.params.slug;

    api.getHome(req, res, next)
    .then((home) => {
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
      api.populateCityForHome(home)
      .then(() => {
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

  app.get('/homes/:slug/:type(details|story|contact)', function(req, res, next) {
    returnHomeBySlug(req, res, next);
  });
};
