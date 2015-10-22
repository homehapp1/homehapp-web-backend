import QueryBuilder from '../../lib/QueryBuilder';
let debug = require('debug')('routes/pages');

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
      res.locals.data.HomeStore = {
        page: result.model
      };
      next();
    })
    .catch(() => {
      // Pass the 404 headers, but allow React to render an error page
      res.status(404);
      next();
    });
  });
};
