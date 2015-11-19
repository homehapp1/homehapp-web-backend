let debug = require('debug')('Server root');
exports.registerRoutes = (app) => {
  app.get('*', app.authenticatedRoute, function(req, res, next) {
    return next();
  });
};
