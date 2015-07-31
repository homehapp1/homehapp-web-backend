"use strict";

import {Forbidden} from "../../lib/Errors";

exports.registerRoutes = (app) => {
  if (!app.authentication) {
    return;
  }

  app.post("/auth/login", function(req, res, next) {
    let loginMethod = app.authentication.resolveLoginMethod(req);
    app.authentication.authenticate(loginMethod, function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        if (info.message === "user not active") {
          return next(new Forbidden("Account not active"));
        }
        return next(new Forbidden("Invalid credentials"));
      }

      req.logIn(user, function(loginErr) {
        if (loginErr) {
          return next(loginErr);
        }

        res.send({status: "ok", user: user});
      });
    })(req, res, next);
  });

  app.post("/auth/logout", function(req, res) {
    req.logOut();
    res.send({status: "ok"});
  });

  app.get("/auth/check", app.authenticatedRoute, function(req, res, next) {
    if (!req.user) {
      return next(new Error("no user found from request!"));
    }

    res.send({status: "ok", user: req.user});
  });
};
