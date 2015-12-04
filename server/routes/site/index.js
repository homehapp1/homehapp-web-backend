import QueryBuilder from '../../lib/QueryBuilder';
import { setLastMod, initMetadata } from '../../../clients/common/Helpers';
import HomesAPI from '../../api/HomesAPI';
let debug = require('debug')('/');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);
  let api = new HomesAPI(app, QB);

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
    api.listHomes(req, {
      populate: {}
    })
    .then((homes) => {
      debug(`Got ${homes.length} homes`);
      initMetadata(res);
      res.locals.data.HomeListStore = {
        items: homes
      };
      res.locals.page = {
        title: 'Discover y',
        description: 'Homehapp - discover y'
      };

      setLastMod([].concat(homes).concat(res.locals.data.HomeListStore), res);
      next();
    //
    //   return QB
    //   .forModel('Neighborhood')
    //   .query({
    //     enabled: true
    //   })
    //   .findAll()
    //   .fetch();
    // })
    // .then((result) => {
    //   res.locals.data.NeighborhoodListStore = {
    //     items: result.models
    //   };
    //   setLastMod([].concat(result.models).concat(res.locals.data.HomeListStore), res);
    //
    //   // return res.json(res.locals.data);
    //   next();
    });
  });
};
