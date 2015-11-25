// let debug = require('debug')('/auth/login');

exports.registerRoutes = (app) => {

  app.get('/auth/login', function(req, res) {
    app.getLocals(req, res, {
      includeClient: false,
      bodyClass: 'adminLogin',
      csrfToken: req.csrfToken(),
      redirectUrl: req.query.redirectUrl || '/'
    })
    .then((locals) => {
      //locals.layout = null;
      res.render('login', locals);
    });
  });

};
