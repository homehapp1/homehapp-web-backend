"use strict";

import csrf from "csurf";

exports.configure = function(app, config) {
  return new Promise((resolve) => {
    if (config.csrf) {
      let csrfProtection = csrf({});
      if (!app.authentication) {
        csrfProtection = csrf({
          cookie: true
        });
        app.use(require("cookie-parser")());
      }
      app.use(csrfProtection);
    }

    if (config.xframe && config.xframe.length) {
      if (["DENY", "SAMEORIGIN"].indexOf(config.xframe) === -1
        && !config.xframe.match(/ALLOW\-FROM /))
      {
        console.warn(`Configured X-Frame-Options value ${config.xframe} is not allowed. Skipping.`);
      } else {
        app.use(function xFrameProtection(req, res, next) {
          res.header("X_FRAME_OPTIONS", config.xframe);
          next();
        });
      }
    }

    resolve();
  });
};
