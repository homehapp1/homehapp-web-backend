"use strict";

import basicAuth from "basic-auth-connect";

let debug = require("debug")("Authentication:BasicAdapter");

exports.register = function (parent, app, config) {
  app.use(basicAuth(config.username, config.password));
};
