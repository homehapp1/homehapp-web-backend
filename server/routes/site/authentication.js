let debug = require('debug')('/auth/login');

exports.registerRoutes = (app) => {
  app.get('/auth/login', function(req, res, next) {
    next();
  });
};
