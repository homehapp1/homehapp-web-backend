"use strict";

import {Forbidden} from "../../lib/Errors";

exports.registerRoutes = (app) => {

  app.get("/auth/login", function(req, res, next) {
    app.getLocals(req, res, {
      includeClient: false,
      bodyClass: "adminLogin",
      csrfToken: req.csrfToken()
    })
    .then((locals) => {
      //locals.layout = null;
      res.render("login", locals);
    });
  });

};
