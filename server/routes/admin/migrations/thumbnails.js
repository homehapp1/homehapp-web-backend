import QueryBuilder from '../../../lib/QueryBuilder';
let debug = require('debug')('/migrations/thumbnails');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/migrations/thumbnails', app.authenticatedRoute, function(req, res, next) {
    QB
    .forModel('Home')
    .parseRequestArguments(req)
    //.populate(populate)
    .select('uuid images story')
    .findAll()
    .fetch()
    .then((result) => {
      let payload = {
        token: req.csrfToken(),
        homes: result.modelsJson
      };

      app.getLocals(req, res, {
        includeClient: true,
        bodyClass: 'adminMigrate',
        csrfToken: req.csrfToken(),
        includeJS: [
          '//code.jquery.com/jquery-1.11.3.min.js',
          `${app.revisionedStaticPath}/js/migrators/thumbnailer.js`
        ],
        payload: payload
      })
      .then((locals) => {
        //locals.layout = null;
        res.render('migration/thumbnails', locals);
      });
    })
    .catch(next);
  });

};
