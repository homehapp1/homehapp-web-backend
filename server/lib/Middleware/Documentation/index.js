import basicAuth from 'basic-auth-connect';
import express from 'express';
import fs from 'fs';
import path from 'path';

exports.configure = function(app, config) {
  return new Promise((resolve) => {
    if (!config.expose) {
      return resolve();
    }

    let basicAuthedRoute = [];
    if (config.auth.enabled) {
      basicAuthedRoute.push(
        basicAuth(config.auth.username, config.auth.password)
      );
    }

    let docsDir = path.join(app.PROJECT_ROOT, 'docs', 'api');
    if (fs.existsSync(docsDir)) {
      app.log.debug(
        `Exposing api docs to /api-docs from file path ${docsDir}.`
      );
      app.use('/api-docs', basicAuthedRoute, express.static(docsDir));
    }

    resolve();
  });
};
