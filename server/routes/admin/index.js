"use strict";

exports.registerRoutes = (app) => {
  app.get("/", function(req, res, next) {
    next();
  });
};
