// let debug = require('debug')('/auth/login');

exports.registerRoutes = (app) => {
  app.get('/auth/login', function(req, res) {
    let redirectTo = '/';

    if (req.query.redirectTo) {
      redirectTo = req.query.redirectTo;
    }

    if (req.body.redirectTo) {
      redirectTo = req.body.redirectTo;
    }

    app.getLocals(req, res, {
      includeClient: false,
      bodyClass: 'adminLogin',
      csrfToken: req.csrfToken(),
      redirectUrl: redirectTo
    })
    .then((locals) => {
      //locals.layout = null;
      res.render('login', locals);
    });
  });
};
