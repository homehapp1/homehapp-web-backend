"use strict";

//import moment from "moment";

import {Strategy as LocalStrategy} from "passport-local";

import QueryBuilder from "../../../QueryBuilder";
import {Forbidden} from "../../../Errors";

let debug = require("debug")("Authentication:LocalAdapter");

/*, config*/
let initSessionStore = function(app) {
  let store = null;

  if (app.config.database.adapter === "mongoose") {
    let MongoStore = require("connect-mongodb");
    store = new MongoStore({ db: app.db.connection.db });
  }

  return store;
};

exports.register = function (parent, app, config) {
  const QB = new QueryBuilder(app);

  if (config.session) {
    let session = require("express-session");

    if (app.config.env !== "test") {
      parent.sessionStore = initSessionStore(app, config.session);
    }

    let sessionConfig = {
        name: config.session.name,
        secret: config.session.secret,
        resave: true,
        saveUninitialized: false
    };

    if (config.cookie) {
      sessionConfig.cookie = {
        maxAge: (config.cookie.maxAge * 1000)
      };
    }

    if (parent.sessionStore) {
      sessionConfig.store = parent.sessionStore;
    }

    app.use(session(sessionConfig));
  }

  parent.authentication.use("local", new LocalStrategy((username, password, done) => {
    debug("passport:local", username);

    QB
    .query("User")
    .findByUsername(username)
    .fetch()
    .then((result) => {
      if (!result.user) {
        return done(null, false, { message: "unknown user" });
      }

      if (!result.user.isValidPassword(password)) {
        return done(null, false, { message: "invalid password" });
      }

      // TODO: Handle this through QB also
      // result.user.set({
      //   _lastLogin: moment().utc().toDate()
      // });
      // result.user.save();

      done(null, result.user);
    })
    .catch(done);
  }));

  app.authenticatedRoute.push(function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next(new Forbidden("not enough permissions"));
    }
    next();
  });

  parent.authentication.autoSignInAs = (username, password, done) => {
    let req = {
      body: {
        username: username,
        password: password
      }
    }, res = {};

    parent.authentication.authenticate("local", (authErr, user) => {
      if (authErr) {
        return done(authErr);
      }
      parent.authentication.deserializeUser(user.id, (err, deserializedUser) => {
        if (err) {
          return done(err);
        }
        parent.authentication._autoSignedUser = deserializedUser;
        done(null, deserializedUser);
      });
    })(req, res);
  };
};
