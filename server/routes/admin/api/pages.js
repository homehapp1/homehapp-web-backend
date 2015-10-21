import QueryBuilder from '../../../lib/QueryBuilder';
//import {/*NotImplemented, */BadRequest} from '../../../lib/Errors';
let debug = require('debug')('/api/pages');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  let populate = {
    createdBy: {},
    updatedBy: {}
  };

  app.get('/api/pages', app.authenticatedRoute, function(req, res, next) {
    QB
    .forModel('Page')
    .parseRequestArguments(req)
    .populate(populate)
    .findAll()
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        pages: result.models.map((page) => {
          return page.toJSON();
        })
      });
    })
    .catch(next);
  });

  app.post('/api/pages', app.authenticatedRoute, function(req, res, next) {
    debug('API update page with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.page;

    if (req.user) {
      data.createdBy = req.user.id;
      data.updatedBy = req.user.id;
    }

    QB
    .forModel('Page')
    .populate(populate)
    .createNoMultiset(data)
    .then((model) => {
      res.json({
        status: 'ok',
        page: model
      });
    })
    .catch(next);
  });


  app.get('/api/pages/:uuid', app.authenticatedRoute, function(req, res, next) {
    debug('API fetch page with uuid', req.params.uuid);

    QB
    .forModel('Page')
    .populate(populate)
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        page: result.page
      });
    })
    .catch(next);

  });

  let updatePage = function updatePage(uuid, data) {
    debug('Update page with data', data);
    return QB
    .forModel('Page')
    .findByUuid(uuid)
    .updateNoMultiset(data);
  };

  app.put('/api/pages/:uuid', app.authenticatedRoute, function(req, res, next) {
    debug('API update page with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.page;

    if (req.user) {
      data.updatedBy = req.user.id;
    }

    updatePage(req.params.uuid, data)
    .then((model) => {
      res.json({
        status: 'ok',
        page: model
      });
    })
    .catch(next);
  });

  app.delete('/api/pages/:uuid', app.authenticatedRoute, function(req, res, next) {
    QB
    .forModel('Page')
    .findByUuid(req.params.uuid)
    .remove()
    .then((result) => {
      res.json({
        status: 'deleted',
        page: result.model
      });
    })
    .catch(next);
  });
};
