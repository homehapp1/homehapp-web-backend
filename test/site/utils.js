"use strict";

import app from "../app";

const TEST_USER_DATA = exports.TEST_USER_DATA = {
  email: "test@qvik.fi",
  username: "test",
  password: "test"
};

let createApp = exports.createApp = (done) => {
  app.run("site", (app) => done(null, app));
};
