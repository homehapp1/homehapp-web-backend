import {Forbidden} from '../../lib/Errors';

exports.registerRoutes = (app) => {
  if (!app.authentication) {
    return;
  }

  let authError = (req, res) => {
    let redirectTo = '/';

    if (req.query.redirectTo) {
      redirectTo = req.query.redirectTo;
    }

    if (req.body.redirectTo) {
      redirectTo = req.body.redirectTo;
    }

    res.status(403);
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
  };

  app.post('/auth/login', function(req, res, next) {
    let loginMethod = app.authentication.resolveLoginMethod(req);

    let redirectTo = '/';
    if (req.query.redirectTo) {
      redirectTo = req.query.redirectTo;
    }
    if (req.body.redirectTo) {
      redirectTo = req.body.redirectTo;
    }

    app.authentication.authenticate(loginMethod, function(err, user, info) {
      if (err) {
        return authError(req, res, next);
      }

      if (!user) {
        if (info.message === 'user not active') {
          authError(req, res, next);
          return next(new Forbidden('Account not active'));
        }
        return authError(req, res, next);
        // return next(new Forbidden('Invalid credentials'));
      }

      req.logIn(user, function(loginErr) {
        if (loginErr) {
          return authError(req, res, next);
        }

        if (req.xhr) {
          return res.send({status: 'ok', user: user});
        }

        res.redirect(redirectTo);
      });
    })(req, res, next);
  });

  app.get('/auth/logout', function(req, res) {
    req.logOut();

    let redirectTo = '/';
    if (req.query.redirectTo) {
      redirectTo = req.query.redirectTo;
    }
    if (req.body.redirectTo) {
      redirectTo = req.body.redirectTo;
    }

    res.redirect(redirectTo);
  });

  app.post('/auth/logout', function(req, res) {
    return res.send({status: 'ok'});
  });

  app.get('/auth/check', app.authenticatedRoute, function(req, res, next) {
    if (!req.user) {
      return next(new Error('no user found from request!'));
    }

    res.send({
      status: 'ok',
      user: req.user.publicData
    });
  });
};
