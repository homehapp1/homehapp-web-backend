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

    let jsIncludeHtml = '';

    if (ext.includeJS && ext.includeJS.length) {
      ext.includeJS.forEach((path) => {
        let tag = `<script type="text/javascript" src="${path}"></script>`;
        jsIncludeHtml += tag;
      });
    }

    let opts = merge({
      layout: 'layout',
      staticPath: app.staticPath,
      revisionedStaticPath: app.revisionedStaticPath,
      revision: app.PROJECT_REVISION,
      site: {
        title: '',
        host: app.config.host
      },
      user: cleanUser(),
      env: app.config.env,
      html: '',
      cssIncludeHtml: '',
      jsIncludeHtml: jsIncludeHtml,
      bodyClass: '',
      metadatas: [],
      openGraph: {}
    }, appLocals, resLocals, ext);

    if (!opts.body) {
      opts.body = '';
    }

    return Promise.resolve(opts);
  };

  return Promise.resolve();
}
