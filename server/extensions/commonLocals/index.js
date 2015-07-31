"use strict";

import {merge} from "../../lib/Helpers";

//let debug = require("debug")("Extension:commonLocals");

export function register(app) {
  app.getLocals = function(req, res, ext = {}) {
    ext.locals = ext.locals || {};

    let user = req.user;

    function cleanUser() {
      if (!user) {
        return null;
      }
      return user.toJSON();
    }

    let appLocals = JSON.parse(JSON.stringify(app.locals)) || {};
    let resLocals = JSON.parse(JSON.stringify(res.locals)) || {};

    let opts = merge({
      layout: "layout",
      staticPath: "/static",
      site: {
        title: "",
        host: app.config.host
      },
      user: cleanUser(),
      cssIncludeHtml: "",
      jsIncludeHtml: ""
    }, appLocals, resLocals, ext.locals);

    return Promise.resolve(opts);
  };

  return Promise.resolve();
}
