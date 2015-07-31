"use strict";

import {Forbidden} from "../../lib/Errors";

exports.registerRoutes = (app) => {

  app.get("/auth/login", function(req, res, next) {
    app.getLocals(req, res)
    .then((locals) => {
      res.render("login", locals);
    });
  });

};
