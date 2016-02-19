import QueryBuilder from '../../lib/QueryBuilder';
let debug = require('debug')('routes/pages');
import { setLastMod, initMetadata } from '../../../clients/common/Helpers';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/:slug', function(req, res, next) {
    debug(`/${req.params.slug}`);

    // Restrict immediately some keywords out
    if (['home', 'homes', 'search', 'neighborhoods', 'api', 'auth'].indexOf(req.params.slug) !== -1) {
      debug('Reserved keyword, pass through');
      return next();
    }

    QB
    .forModel('Page')
    .findBySlug(req.params.slug)
    .fetch()
    .then((result) => {
      let page = result.model;
      res.locals.data.title = [page.title];
      res.locals.page = {
        title: page.title
        // description: description
      };
      res.locals.data.PageStore = {
        model: page
      };
      initMetadata(res);
      setLastMod([page], res);
      next();
    })
    .catch(() => {
      // Pass the 404 headers, but allow React to render an error page
      debug('page not found');
      res.status(404);
      next();
    });
  });
};
