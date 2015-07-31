'use strict';

import basicAuth from 'basic-auth-connect';

exports.register = function (parent, app, config) {
  app.use(basicAuth(config.username, config.password));
};
