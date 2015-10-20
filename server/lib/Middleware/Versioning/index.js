exports.configure = function(app, config = {}) {
  app.use((req, res, next) => {
    req.originalUrl = req.url;

    let re = new RegExp(config.pathRegexp);

    req.version = 0;
    if (req.url.match(re)) {
      let version = re.exec(req.url)[1];
      if (version) {
        req.version = parseInt(version);
      }
      req.url = req.url.replace(/\/v[0-9]/, '');
    }

    if (req.headers && req.headers[config.headerKey.toLowerCase()]) {
      req.version = req.headers[config.headerKey.toLowerCase()];
    }

    next();
  });

  return Promise.resolve();
};
