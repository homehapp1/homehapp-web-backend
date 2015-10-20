exports.registerRoutes = (app) => {

  app.get('/auth/login', function(req, res) {
    app.getLocals(req, res, {
      includeClient: false,
      bodyClass: 'adminLogin',
      csrfToken: req.csrfToken()
    })
    .then((locals) => {
      //locals.layout = null;
      res.render('login', locals);
    });
  });

};
