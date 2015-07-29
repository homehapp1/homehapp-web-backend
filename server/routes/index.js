"use strict";

exports.registerRoutes = (app) => {
  app.get("/health", function(req, res) {
    res.send("OK");
  });

  app.get("/", function(req, res, next) {
    next();
    // app.getLocals(req, res)
    // .then((locals) => {
    //   res.render("index", locals);
    // });
  });
};
