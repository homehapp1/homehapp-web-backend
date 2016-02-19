import QueryBuilder from '../../lib/QueryBuilder';
let debug = require('debug')('/agents');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get('/agents', app.authenticatedRoute, function(req, res, next) {
    debug('fetch agents');
    debug('req.query', req.query);

    QB
    .forModel('Agent')
    .parseRequestArguments(req)
    .findAll()
    .fetch()
    .then((result) => {
      res.locals.data.AgentListStore = {
        agents: result.agentsJson
      };
      next();
    })
    .catch(next);

  });

  app.get('/agents/create', app.authenticatedRoute, function(req, res, next) {
    debug('Create a blank agent');
    let model = new (QB.forModel('Agent')).Model();
    debug('Created a blank', model);
    res.locals.data.AgentListStore = {
      agents: [model]
    };
    next();
  });

  app.get('/agents/edit/:uuid', app.authenticatedRoute, function(req, res, next) {
    debug('Fetch agent by uuid', req.params.uuid);
    QB
    .forModel('Agent')
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {
      res.locals.data.AgentListStore = {
        agents: result.models
      };
      next();
    })
    .catch(next);
  });
};
