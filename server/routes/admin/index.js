'use strict';

exports.registerRoutes = (app) => {
  app.get('*', app.authenticatedRoute);
};
