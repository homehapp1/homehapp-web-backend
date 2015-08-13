'use strict';

import {merge} from '../../lib/Helpers';

//let debug = require('debug')('Extension:commonLocals');

export function register(app) {

  app.getLocals = function(req, res, ext = {}) {
    ext = ext || {};

    let user = req.user;

    function cleanUser() {
      if (!user) {
        return null;
      }
      if (user.toJSON) {
        return user.toJSON();
      }
      return null;
    }

    let appLocals = JSON.parse(JSON.stringify(app.locals)) || {};
    let resLocals = JSON.parse(JSON.stringify(res.locals)) || {};

    let staticPath = '/public';
    if (app.config.env !== 'development') {
      if (app.cdn && app.cdn.getStaticPath) {
        staticPath = app.cdn.getStaticPath();
      }
    }

    let opts = merge({
      layout: 'layout',
      staticPath: staticPath,
      site: {
        title: '',
        host: app.config.host
      },
      user: cleanUser(),
      env: app.config.env,
      html: '',
      cssIncludeHtml: '',
      jsIncludeHtml: '',
      bodyClass: '',
      metadatas: []
    }, appLocals, resLocals, ext);

    if (!opts.body) {
      opts.body = '';
    }

    return Promise.resolve(opts);
  };

  return Promise.resolve();
}
