import QueryBuilder from '../../lib/QueryBuilder';
let debug = require('debug')('/api/homes');

import {BadRequest} from '../../lib/Errors';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  let checkAuthenticationNeed = [
    function(req, res, next) {
      if (req.headers['x-homehapp-auth-token']) {
        return app.authenticatedRoute.forEach((handler) => {
          handler(req, res, next);
        });
      }
      return next();
    }
  ];

  let populateAttributes = {
    'location.neighborhood': {},
    createdBy: 'uuid',
    updatedBy: 'uuid'
  };

  let getId = function getId(obj) {
    if (typeof obj === 'string' || !obj) {
      return obj;
    }

    if (typeof obj.uuid === 'string') {
      return obj.uuid;
    }

    if (typeof obj.id === 'string') {
      return obj.id;
    }

    return obj;
  };

  // Strip the model from Mongoose features and normalize UUIDs
  let normalizeHome = function normalizeHome(home) {
    home = JSON.parse(JSON.stringify(home));
    home.createdBy = getId(home.createdBy);
    home.updatedBy = getId(home.updatedBy);
    return home;
  };

  let updateHome = function updateHome(user, uuid, data) {
    debug('Update home with data', data);

    let query = {};

    if (user) {
      query.createdBy = user.id;
    }

    return QB
    .forModel('Home')
    .query(query)
    .findByUuid(uuid)
    .populate(populateAttributes)
    .updateNoMultiset(data);
  };

  /**
   * @apiDefine HomeSuccessResponse
   * @apiVersion 0.1.0
   *
   * @apiSuccess {String} id                Uuid of the home
   * @apiSuccess {String} slug              URL Slug of the Home
   * @apiSuccess {String} announcementType  Wether this home is for rent or for buy. Enum ['buy', 'rent']
   * @apiSuccess {String} description       Description of the Home
   * @apiSuccess {Object} details           Home details
   * @apiSuccess {Number} details.area      Area in square meters
   * @apiSuccess {String} details.freeform  Freeform description
   * @apiSuccess {Object} location                  Location details
   * @apiSuccess {Object} location.address          Location address details
   * @apiSuccess {String} location.address.street   Street address
   * @apiSuccess {String} location.address.apartment   Apartment
   * @apiSuccess {String} location.address.city     City
   * @apiSuccess {String} location.address.zipcode   zipcode
   * @apiSuccess {String} location.address.country   Country
   * @apiSuccess {Array}  location.coordinates   Map coordinates. [LAT, LON]
   * @apiSuccess {Object} location.neighborhood   Neighborhood object TODO: Define
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
  app.get('/api/homes', checkAuthenticationNeed, function(req, res, next) {
    let query = {
      enabled: {
        $ne: false
      }
    };

    if (req.user) {
      query.createdBy = {
        $ne: req.user.id
      };
    }

    QB
    .forModel('Home')
    .parseRequestArguments(req)
    .populate(populateAttributes)
    .query(query)
    .findAll()
    .fetch()
    .then((result) => {
      let homes = result.models.map((home) => {
        return normalizeHome(home);
      });
      res.json({
        status: 'ok',
        homes: homes
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
    .populate(populateAttributes)
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        home: normalizeHome(result.home)
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
  app.put('/api/homes/:uuid', app.authenticatedRoute, function(req, res, next) {
    debug('API update home with uuid', req.params.uuid);
    debug('req.body', req.body);

    let data = req.body.home;

    // Force enable the home for now
    data.enabled = true;

    updateHome(req.user, req.params.uuid, data)
    .then((model) => {
      res.json({
        status: 'ok',
        home: normalizeHome(model)
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
  app.post('/api/homes', app.authenticatedRoute, function(req, res, next) {
    debug('API create home');

    QB
    .forModel('Home')
    .createNoMultiset({
      enabled: false,
      createdBy: req.user
    })
    .then((model) => {
      res.json({
        status: 'ok',
        home: normalizeHome(model)
      });
    })
    .catch(next);
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
  app.delete('/api/homes/:uuid', app.authenticatedRoute, function(req, res, next) {
    QB
    .forModel('Home')
    .findByUuid(req.params.uuid)
    .remove()
    .then((result) => {
      res.json({
        status: 'deleted',
        home: normalizeHome(result.model)
      });
    })
    .catch(next);
  });

};
