import QueryBuilder from '../../../lib/QueryBuilder';
//import {/*NotImplemented, */BadRequest} from '../../../lib/Errors';
let debug = require('debug')('/api/homes');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  let populate = {
    'location.neighborhood': {
      select: 'uuid title slug'
    },
    agents: {},
    createdBy: {},
    updatedBy: {}
  };

  app.get('/api/homes', app.authenticatedRoute, function(req, res, next) {
    QB
    .forModel('Home')
    .parseRequestArguments(req)
    .populate(populate)
    .findAll()
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        homes: result.models.map((home) => {
          return home.toJSON();
        })
      });
    })
    .catch(next);
  });

  app.post('/api/homes', app.authenticatedRoute, function(req, res, next) {
    debug('Admin create home');
    //debug('req.body', req.body);

    let data = req.body.home;

    // if (!data.description) {
    //   return next(new BadRequest('invalid request body'));
    // }

    if (req.user) {
      data.createdBy = req.user.id;
      data.updatedBy = req.user.id;
    }

    function createHome() {
      return QB
      .forModel('Home')
      .populate(populate)
      .createNoMultiset(data)
      .then((model) => {
        res.json({
          status: 'ok',
          home: model
        });
      })
      .catch(next);
    }

    if (data.location.neighborhood) {
      let neighborhoodUuid = data.location.neighborhood;
      data.location.neighborhood = null;
      QB
      .forModel('Neighborhood')
      .findByUuid(neighborhoodUuid)
      .fetch()
      .then((result) => {
        debug('Got neighborhood', result.model.title, result.model.id);
        data.location.neighborhood = result.model.id;
        createHome(data);
      })
      .catch((nhError) => {
        app.log.error(`Error fetching Neighborhood: ${nhError.message}`);
        createHome(data);
      });
    } else {
      createHome(data);
    }
  });


  app.get('/api/homes/:uuid', app.authenticatedRoute, function(req, res, next) {
    debug('API fetch home with uuid', req.params.uuid);
    QB
    .forModel('Home')
    .populate(populate)
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        home: result.home
      });
    })
    .catch(next);

  });

  let updateHome = function updateHome(uuid, data) {
    debug('Update home with data', data);

    if (data.agents) {
      //let agents = [];
      debug('Get agents');
      let ids = [];
      let uuids = [];

      for (let agent of data.agents) {
        if (typeof agent === 'object' && agent.id) {
          agent = agent.id;
        }

        if (agent.toString().match(/^[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12}$/)) {
          // a7b4ca90-6ce4-40a2-bf49-bca9f6219700
          debug('Matched UUID', agent);
          uuids.push(agent.toString());
        } else {
          debug('Did not match UUID', agent);
          ids.push(agent);
        }
      }
      debug('Get for', uuids);

      if (uuids.length) {
        debug('Got UUIDS', uuids);
        return new Promise((resolve) => {
          QB.forModel('Agent')
          .query({
            uuid: {
              $in: uuids
            }
          })
          .findAll()
          .fetch()
          .then((result) => {
            for (let agent of result.models) {
              debug('Got agent', agent);
              ids.push(agent.id);
            }
            data.agents = ids;
            debug('Update with agents', data.agents);
            updateHome(uuid, data)
            .then((model) => {
              resolve(model);
            });
          })
          .catch((err) => {
            debug('Failed', err);
          });
        });
      }
    }

    if (data.location && data.location.neighborhood && String(data.location.neighborhood).match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{8}/)) {
      debug('Get neighborhood', data.location.neighborhood);
      return new Promise((resolve) => {
        QB
        .forModel('Neighborhood')
        .findByUuid(data.location.neighborhood)
        .fetch()
        .then((result) => {
          debug('Got neighborhood', result.model.title, result.model.id);
          data.location.neighborhood = result.model;

          QB
          .forModel('Home')
          .findByUuid(uuid)
          .updateNoMultiset(data)
          .then((model) => {
            debug('Updated', model);
            resolve(model);
          })
          .catch((err) => {
            debug('Failed', err);
          });
        });
      });
    }

    return QB
    .forModel('Home')
    .findByUuid(uuid)
    .updateNoMultiset(data);
  };

  app.put('/api/homes/:uuid', app.authenticatedRoute, function(req, res, next) {
    debug('API update home with uuid', req.params.uuid);
    //debug('req.body', req.body);

    let data = req.body.home;

    if (req.user) {
      data.updatedBy = req.user.id;
    }

    updateHome(req.params.uuid, data)
    .then((model) => {
      res.json({
        status: 'ok',
        home: model
      });
    })
    .catch(next);
  });

  // app.patch('/api/homes/:uuid', function(req, res, next) {
  //   debug('API update home with uuid', req.params.uuid);
  //   //debug('req.body', req.body);
  //
  //   let data = req.body.home;
  //
  //   updateHome(req.params.uuid, data)
  //   .then((model) => {
  //     res.json({
  //       status: 'ok', home: model
  //     });
  //   })
  //   .catch(next);
  // });

  app.delete('/api/homes/:uuid', app.authenticatedRoute, function(req, res, next) {
    QB
    .forModel('Home')
    .findByUuid(req.params.uuid)
    .remove()
    .then((result) => {
      res.json({
        status: 'deleted',
        home: result.model
      });
    })
    .catch(next);
  });
};
