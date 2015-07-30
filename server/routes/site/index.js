"use strict";

exports.registerRoutes = (app) => {
  app.get("/", function(req, res, next) {
    next();
    // app.getLocals(req, res)
    // .then((locals) => {
    //   res.render("index", locals);
    // });
  });
};
