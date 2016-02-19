import QueryBuilder from '../../lib/QueryBuilder';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/neighborhoods', app.authenticatedRoute, function(req, res, next) {
    console.log('fetch neighborhoods');
    console.log('req.query', req.query);

    QB
    .forModel('Neighborhood')
    .parseRequestArguments(req)
    .findAll()
    .fetch()
    .then((result) => {
      res.locals.data.NeighborhoodListStore = {
        neighborhoods: result.neighborhoodsJson
      };
      next();
    })
    .catch(next);
  });

  let redirectBySlug = (req, res, next) => {
    QB
    .forModel('Neighborhood')
    .parseRequestArguments(req)
    .findBySlug(req.params.slug)
    .fetch()
    .then((result) => {
      res.redirect(301, `/neighborhoods/${result.model.uuid}`);
    })
    .catch(() => {
      next();
    });
  };

  app.get('/neighborhoods/:city/:slug', app.authenticatedRoute, function(req, res, next) {
    return redirectBySlug(req, res, next);
  });
  app.get('/neighborhoods/:slug', app.authenticatedRoute, function(req, res, next) {
    return redirectBySlug(req, res, next);
  });
};
