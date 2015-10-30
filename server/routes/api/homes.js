import QueryBuilder from '../../lib/QueryBuilder';
//let debug = require('debug')('/api/homes');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

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

  /**
   * @apiDefine HomeSuccessResponse
   * @apiVersion 0.1.0
   *
   * @apiSuccess {String} id                Uuid of the home
   * @apiSuccess {String} title             Title of the Home
   * @apiSuccess {Datetime} createdAt       ISO-8601 Formatted Creation Datetime
   * @apiSuccess {Datetime} updatedAt       ISO-8601 Formatted Updation Datetime
   * @apiSuccess {Integer} createdAtTS      EPOCH formatted timestamp of the creation time
   * @apiSuccess {Integer} updatedAtTS      EPOCH formatted timestamp of the updation time
   *
   */

  /**
    * @apiDefine HomeBody
    * @apiVersion 0.1.0
    *
    * @apiParam {Object} home                  Home object
    * @apiParam {String} home.title            Title of the Home
    *
    */

  /**
   * @api {get} /api/homes Fetch All Homes
   * @apiVersion 0.1.0
   * @apiName GetHomes
   * @apiGroup Homes
   *
   * @apiDescription Route for fetching Homes
   *
   * @apiUse MobileRequestHeaders
   * @apiUse HomeSuccessResponse
   *
   * @apiParam (Query) {String} [sort=desc]          Sort order. Enum: ['asc', 'desc']
   * @apiParam (Query) {String} [sortBy=updatedAt]   Which field to use for sorting
   * @apiParam (Query) {Number} [limit=20]           How many items to fetch
   * @apiParam (Query) {Number} [skip]               How many items to skip
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       'status': 'ok',
   *       'homes': [...]
   *     }
   *
   */
  app.get('/api/homes', function(req, res, next) {
    QB
    .forModel('Home')
    .parseRequestArguments(req)
    .populate({
      'location.neighborhood': {}
    })
    .findAll()
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        homes: result.models
      });
    })
    .catch(next);
  });

  /**
   * @api {get} /api/homes/:uuid Get home by id
   * @apiVersion 0.1.0
   * @apiName GetHomeById
   * @apiGroup Homes
   * @apiDescription Fetch Single Home
   *
   * @apiParam {String} id Home's internal id
   *
   * @apiUse MobileRequestHeaders
   * @apiUse HomeSuccessResponse
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       'status': 'ok',
   *       'home': {...}
   *     }
   *
   * @apiError (404) NotFound   Home with given id was not found
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       'status': 'failed',
   *       'error': 'model not found'
   *     }
   */
  app.get('/api/homes/:uuid', function(req, res, next) {
    QB
    .forModel('Home')
    .populate({
      'location.neighborhood': {}
    })
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

  /**
   * @api {put} /api/homes/:id Update home
   * @apiVersion 0.1.0
   * @apiName UpdateHome
   * @apiGroup Homes
   * @apiDescription Update home by uuid
   *
   * @apiUse MobileRequestHeaders
   * @apiUse HomeBody
   * @apiUse HomeSuccessResponse
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       'status': 'ok',
   *       'home': {...}
   *     }
   *
   */
  app.put('/api/homes/:uuid', function(req, res, next) {
    debug('API update home with uuid', req.params.uuid);
    debug('req.body', req.body);

    let data = req.body.home;

    updateHome(req.params.uuid, data)
    .then((model) => {
      res.json({
        status: 'ok',
        home: model
      });
    })
    .catch(next);
  });

  /**
   * @api {post} /api/homes Create home
   * @apiVersion 0.1.0
   * @apiName CreateHome
   * @apiGroup Homes
   * @apiDescription Creates home, currently without authentication
   *
   * @apiUse MobileRequestHeaders
   * @apiUse HomeBody
   * @apiUse HomeSuccessResponse
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       'status': 'ok',
   *       'home': {...}
   *     }
   *
   */
  app.post('/api/homes', function(req, res, next) {
    debug('API create home');
    debug('req.body', req.body);

    let data = req.body.home;

    function createHome() {
      return QB
      .forModel('Home')
      .populate({
        'location.neighborhood': {}
      })
      .createNoMultiset(data)
      .then((model) => {
        res.json({
          status: 'ok', home: model
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

  /**
   * @api {delete} /api/homes/:id Delete home
   * @apiVersion 0.1.0
   * @apiName DeleteHome
   * @apiGroup Homes
   * @apiDescription Deletes given home
   *
   * @apiParam {String} id Home's internal id
   *
   * @apiUse MobileRequestHeaders
   * @apiUse HomeBody
   * @apiUse HomeSuccessResponse
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       'status': 'deleted',
   *       'home': {...}
   *     }
   */
  app.delete('/api/homes/:uuid', function(req, res, next) {
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
