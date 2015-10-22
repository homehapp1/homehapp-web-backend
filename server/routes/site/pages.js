import QueryBuilder from '../../lib/QueryBuilder';
let debug = require('debug')('routes/pages');
import { setLastMod, initMetadata } from '../../../clients/common/Helpers';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/:slug', function(req, res, next) {
    debug(`/${req.params.slug}`);

    // Restrict immediately some keywords out
    if (['home', 'homes', 'search', 'neighborhoods', 'api'].indexOf(req.params.slug) !== -1) {
      debug('Reserved keyword, pass through');
      next();
    }

    QB
    .forModel('Page')
    .findBySlug(req.params.slug)
    .fetch()
    .then((result) => {
      debug('Page fetched', result);
      let page = result.model;

      initMetadata(res);
      setLastMod([page]);
      res.locals.data.title = [page.title];
      res.locals.page = {
        title: page.title
        // description: description
      };
      res.locals.data.PageStore = {
        page: page
      };
      debug('Set local data', res.locals.page, res.locals.data);
      next();
    })
    .catch(() => {
      // Pass the 404 headers, but allow React to render an error page
      res.status(404);
      next();
    });
  });
};
