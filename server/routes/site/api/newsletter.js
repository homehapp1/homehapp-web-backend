let debug = require('debug')('/api/newsletter');
let superagent = require('superagent');

exports.registerRoutes = (app) => {
  let apikey = '9c1a33b75b3198da77528a1eaf139cd4-us12';

  app.post('/api/newsletter', function(req, res, next) {
    debug('/api/newsletter', req);

    if (!req.body || !req.body.newsletter || !req.body.newsletter.email) {
      debug('no body');
      res.status(422);
      return next();
    }

    superagent
    .post('https://us12.api.mailchimp.com/3.0/lists/914a5e94a5/members')
    .set('Authorization', 'apikey 9c1a33b75b3198da77528a1eaf139cd4-us12')
    .send({
      email_address: req.body.newsletter.email,
      status: 'subscribed'
    })
    .end((e, r) => {
      res
      .status(r.body.status)
      .json({
        status: 'ok',
        data: r.body
      });
      next();
    });
  });
};
