import QueryBuilder from '../../lib/QueryBuilder';
let debug = require('debug')('/api/homes');

import {NotFound, BadRequest} from '../../lib/Errors';
import {merge, exposeHome, exposeHomeWithApp} from '../../lib/Helpers';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  // Pre load QBs
  QB.forModel('User');
  QB.forModel('Home');
  QB.forModel('Neighborhood');
  QB.forModel('Agent');

  let checkAuthenticationNeed = [
    function(req, res, next) {
      let span = app.traceAgent.startSpan(
        'checkAuthenticationNeed', {
          hasToken: (req.headers['x-homehapp-auth-token'] ? 'true' : 'false')
        }
      );

      if (req.headers['x-homehapp-auth-token']) {
        return app.authenticatedRoute.forEach((handler) => {
          app.traceAgent.endSpan(span);
          handler(req, res, next);
        });
      }

      app.traceAgent.endSpan(span);
      return next();
    }
  ];

  let neighborhoodPopulation = {
    select: 'uuid title description story images updatedAt createdAt'
  };

  let populateAttributes = {
    'location.neighborhood': neighborhoodPopulation,
    'myNeighborhood': neighborhoodPopulation,
    agents: {
      select: 'uuid firstname lastname title contactNumber email images'
    },
    createdBy: {
      select: 'uuid _email firstname lastname contact profileImage contactNumber'
    },
    updatedBy: {
      select: 'uuid _email firstname lastname contact profileImage contactNumber'
    }
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
   * @apiVersion 1.0.1
   *
   * @apiSuccess {String} id                Uuid of the home
   * @apiSuccess {String} slug              URL Slug of the Home
   * @apiSuccess {Boolean} enabled          Switch for enabling/disabling the public viewing of the home
   * @apiSuccess {String} title             Home title
   * @apiSuccess {String} announcementType  Home announcement type. Enum ['buy', 'rent', 'story']
   * @apiSuccess {String} description       Description of the Home
   * @apiSuccess {Object} details           Home details
   * @apiSuccess {Number} details.area      Area in square meters
   * @apiSuccess {String} details.freeform  Freeform description
   * @apiSuccess {Object} location                  Location details
   * @apiSuccess {Object} location.address          Location address details
   * @apiSuccess {String} location.address.street   Street address
   * @apiSuccess {String} location.address.apartment   Apartment
   * @apiSuccess {String} location.address.city     City
   * @apiSuccess {String} location.address.sublocality     Sub locality of the location. ie. Kamppi
   * @apiSuccess {String} location.address.zipcode   zipcode
   * @apiSuccess {String} location.address.country   Country
   * @apiSuccess {Array}  location.coordinates   Map coordinates. [LAT, LON]
   * @apiSuccess {Object} location.neighborhood   Neighborhood object TODO: Define
   * @apiSuccess {Object} rooms                   Rooms object (freely defined by client)
   * @apiSuccess {Object} mainImage                Main <a href="#api-Shared-Images">Image</a> of the home
   * @apiSuccess {Array} epc                      EPC <a href="#api-Shared-Images">Image</a> or PDF
   * @apiSuccess {Array} images                    Home <a href="#api-Shared-Images">Images</a>
   * @apiSuccess {Array} floorplans               An array of <a href="#api-Shared-Images">Images</a>, dedicated to floorplans
   * @apiSuccess {Array} brochures                An array of <a href="#api-Shared-Images">Images</a>, dedicated to brochures
   * @apiSuccess {Object} story             Home story blocks
   * @apiSuccess {Boolean} story.enabled    Switch to determine if the story is public
   * @apiSuccess {Array} story.blocks       An array of <a href="#api-Shared-StoryBlock">StoryBlocks</a>
   * @apiSuccess {Object} myNeighborhood          User defined Neighborhood object TODO: define
   * @apiSuccess {Object} likes                   Likes container object
   * @apiSuccess {Number} likes.total             Total likes for this home
   * @apiSuccess {Array} likes.users              Array of User uuids who has liked this home
   * @apiSuccess {Object} createdBy         <a href="#api-Users-UserData">User</a> object of the creator
   * @apiSuccess {Object} updatedBy         UUID of the updater user
   * @apiSuccess {Datetime} createdAt       ISO-8601 Formatted Creation Datetime
   * @apiSuccess {Datetime} updatedAt       ISO-8601 Formatted Updation Datetime
   * @apiSuccess {Integer} createdAtTS      EPOCH formatted timestamp of the creation time
   * @apiSuccess {Integer} updatedAtTS      EPOCH formatted timestamp of the updation time
   */

  /**
   * @apiDefine HomeSuccessResponseJSON
   * @apiVersion 1.0.1
   *
   * @apiSuccessExample {json} JSON serialization of the home
   * {
   *   "id": "00000000-0000-0000-0000-000000000000",
   *   "slug": "...",
   *   "enabled": true,
   *   "title": "Home sweet home",
   *   "announcementType": "story",
   *   "description": "I am an example",
   *   "details": {
   *     "area": ...,
   *     "freeform": "...",
   *   },
   *   "location": {
   *     "address": "221B Baker Street",
   *     "city": "Exampleby",
   *     "sublocality": "Kamppi",
   *     "country": "Great Britain",
   *     "coordinates": [
   *       51.4321,
   *       -0.1234
   *     ],
   *     "neighborhood": {...}
   *   },
   *   "rooms": {
   *     "bathrooms": 1, ...
   *   },
   *   "mainImage": {
   *     "url": "https:*res.cloudinary.com/homehapp/.../example.jpg",
   *     "alt": "View towards the sunset",
   *     "width": 4200,
   *     "height": 2500
   *   },
   *   "images": [
   *     {
   *       "url": "https:*res.cloudinary.com/homehapp/.../example.jpg",
   *       "alt": "View towards the sunset",
   *       "width": 4200,
   *       "height": 2500
   *     },
   *     {
   *       ...
   *     }
   *   ],
   *   "epc": [
   *     {
   *       "url": "https:*res.cloudinary.com/homehapp/.../example.jpg",
   *       "alt": "View towards the sunset",
   *       "width": 4200,
   *       "height": 2500
   *     },
   *     {
   *       ...
   *     }
   *   ],
   *   "floorplans": [
   *     {
   *       "url": "https:*res.cloudinary.com/homehapp/.../example.jpg",
   *       "alt": "View towards the sunset",
   *       "width": 4200,
   *       "height": 2500
   *     },
   *     {
   *       ...
   *     }
   *   ],
   *   "brochures": [
   *     {
   *       "url": "https:*res.cloudinary.com/homehapp/.../example.jpg",
   *       "alt": "View towards the sunset",
   *       "width": 4200,
   *       "height": 2500
   *     },
   *     {
   *       ...
   *     }
   *   ],
   *   "story": {
   *     "enabled": true,
   *     "blocks": [
   *       {
   *         "template": "BigImage",
   *         "properties": {
   *           "image": {
   *             "url": "https:*res.cloudinary.com/homehapp/.../example.jpg",
   *             "alt": "View towards the sunset",
   *             "width": 4200,
   *             "height": 2500
   *           },
   *           "title": "A great spectacle",
   *           "description": "The evening routines of the Sun"
   *         }
   *       }
   *     ]
   *   },
   *   "myNeighborhood": {...},
   *   "likes": {
   *     "total": 0,
   *     "users": [...]
   *   },
   *   "createdBy": {...},
   *   "updatedBy": "...",
   *   "createdAt": "2016-01-13T14:38:01.0000Z",
   *   "updatedAt": "2016-01-13T14:38:01.0000Z",
   *   "createdAtTS": 1452695955,
   *   "updatedAtTS": 1452695955
   * }
   */

  /**
    * @apiDefine HomeBody
    * @apiVersion 1.0.1
    *
    * @apiParam {Object} home                     Home object
    * @apiParam {Boolean} [home.enabled]          Switch for enabling/disabling the public viewing of the home
    * @apiParam {String} [home.title]             Title of the Home
    * @apiParam {String} [home.announcementType]  Home announcement type. Enum ['buy', 'rent', 'story']
    * @apiParam {String} home.description         Textual description of the Home
    * @apiParam {Object} [home.details]           Location details
    * @apiParam {Number} [home.details.area]      Numeric surface area
    * @apiParam {Object} [home.location.address]            Location address details
    * @apiParam {String} [home.location.address.street]     Street address
    * @apiParam {String} [home.location.address.apartment]  Apartment
    * @apiParam {String} [home.location.address.city]       City
    * @apiParam {String} [home.location.address.zipcode]    zipcode
    * @apiParam {String} [home.location.address.country]    Country
    * @apiParam {Array}  [home.location.coordinates]        Map coordinates. [LAT, LON]
    * @apiParam {String} [home.location.neighborhood]       UUID of the Neighborhood
    * @apiParam {Object} [home.costs]                   Costs details
    * @apiParam {String} [home.properties]              Home properties, i.e. list of
    * @apiParam {String} [home.costs.currency='GBP']    Currency. Enum ['EUR', 'GBP', 'USD']
    * @apiParam {Number} [home.costs.sellingPrice]      Selling price
    * @apiParam {Number} [home.costs.rentalPrice]       Rental price
    * @apiParam {Number} [home.costs.councilTax]        Council tax
    * @apiParam {Array}  [home.images]                  An array of <a href="#api-Shared-Images">Images</a>
    * @apiParam {Array}  [home.epc]                     An array of <a href="#api-Shared-Images">Images</a>, dedicated to EPC
    * @apiParam {Array}  [home.floorplans]              An array of <a href="#api-Shared-Images">Images</a>, dedicated to floorplans. Set the floorplan name as image.alt for each image.
    * @apiParam {Array}  [home.brochures]               An array of <a href="#api-Shared-Images">Images</a>, dedicated to brochures. Set the printable brochure name as image.alt for each image.
    * @apiParam {Object} [home.story]                   Story block container object
    * @apiParam {Boolean} [home.story.enabled=false]    Switch to determine if the story is public
    * @apiParam {Array} [home.story.blocks]             An array of <a href="#api-Shared-StoryBlock">StoryBlocks</a>
    * @apiParam {Object} [home.neighborhoodStory]                   Story block container object
    * @apiParam {Boolean} [home.neighborhoodStory.enabled=false]    Switch to determine if the story is public
    * @apiParam {Array} [home.neighborhoodStory.blocks]             An array of <a href="#api-Shared-StoryBlock">StoryBlocks</a>
    */

  /**
   * @apiDefine StateSuccessResponse
   * @apiVersion 1.0.1
   *
   * @apiSuccess {Object} state               State object
   * @apiSuccess {String} state.type          Type of the state information. Enum: ['like']
   * @apiSuccess {Boolean} state.status       Status of the state. (true if set, false is unset)
   * @apiSuccess {Object} [likes]                   Likes container object
   * @apiSuccess {Number} [likes.total]             Total likes for this home
   * @apiSuccess {Array} [likes.users]              Array of User uuids who has liked this home
   */

  /**
   * @api {any} /api/* Home Details
   * @apiVersion 1.0.1
   * @apiName Home details
   * @apiGroup Homes
   *
   * @apiDescription Data for each home object passed from the backend contains the same set of information
   *
   * @apiUse MobileRequestHeaders
   * @apiUse HomeSuccessResponse
   * @apiUse HomeSuccessResponseJSON
   * @apiUse UserSuccessResponseJSON
   */

  /**
   * @api {get} /api/homes Fetch All Homes
   * @apiVersion 1.0.1
   * @apiName GetHomes
   * @apiGroup Homes
   *
   * @apiDescription Route for fetching Homes
   *
   * @apiUse MobileRequestHeaders
   * @apiUse HomeSuccessResponse
   * @apiUse HomeSuccessResponseJSON
   * @apiUse UserSuccessResponseJSON
   *
   * @apiParam (Query) {String} [sort=desc]          Sort order. Enum: ['asc', 'desc']
   * @apiParam (Query) {String} [sortBy=updatedAt]   Which field to use for sorting
   * @apiParam (Query) {Number} [limit=20]           How many items to fetch
   * @apiParam (Query) {Number} [skip]               How many items to skip
   * @apiParam (Query) {String} [updatedSince]       Fetch only items updated after ISO-8601 Formatted Datetime
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "ok",
   *       "homes": [...]
   *     }
   *
   */
  app.get('/api/homes', checkAuthenticationNeed, function(req, res, next) {
    let query = {
      enabled: {
        $ne: false
      }
    };

    // Do not return users own data, as the mobile client should have the master data
    if (req.user) {
      query.createdBy = {
        $ne: req.user.id
      };
    }

    // Filter homes that has been modified since given ISODate string
    if (req.query.updatedSince) {
      query.updatedAt = {
        $gt: req.query.updatedSince
      };
    }

    let span = app.traceAgent.startSpan(
      'queryHomes', {
        query: JSON.stringify(query)
      }
    );

    QB
    .forModel('Home')
    .sort({
      'updatedAt': 'desc',
      'metadata.score': 'desc'
    })
    .parseRequestArguments(req)
    .populate(populateAttributes)
    .query(query)
    .findAll(false)
    .fetch()
    .then((result) => {
      app.traceAgent.endSpan(span);

      span = app.traceAgent.startSpan(
        'prepareResponse', {
          itemCount: result.models.length
        }
      );

      let homes = result.models.map((home) => {
        // return home.toJSON();
        return exposeHome(home);
        // return exposeHomeWithApp(app, home);
      });

      app.traceAgent.endSpan(span);

      res.json({
        status: 'ok',
        homes: homes
      });
    })
    .catch(next);
  });

  /**
   * @api {get} /api/homes/:uuid Get home by id
   * @apiVersion 1.0.1
   * @apiName GetHomeById
   * @apiGroup Homes
   * @apiDescription Fetch Single Home
   *
   * @apiParam {String} id Home's internal id
   *
   * @apiUse MobileRequestHeaders
   * @apiUse HomeSuccessResponse
   * @apiUse HomeSuccessResponseJSON
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "ok",
   *       "home": {...}
   *     }
   * @apiUse UserSuccessResponseJSON
   *
   * @apiError (404) NotFound   Home with given id was not found
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "status": "failed",
   *       "error": "model not found"
   *     }
   */
  app.get('/api/homes/:uuid', checkAuthenticationNeed, function(req, res, next) {
    debug('Try by uuid', req.params.uuid);

    QB
    .forModel('Home')
    .populate(populateAttributes)
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {

      let checkforMyNeighborhood = false;
      if (req.query.my && req.user && !result.home.myNeighborhood) {
        checkforMyNeighborhood = (result.home.createdBy.uuid === req.user.uuid);
      }

      if (checkforMyNeighborhood) {
        QB
        .forModel('Neighborhood')
        .createNoMultiset({
          createdBy: req.user,
          slug: `nh-${req.user.uuid}`, // create something for the slug
          enabled: false
        })
        .then((neighborhood) => {
          result.home.myNeighborhood = neighborhood;
          result.home.save((err) => {
            if (err) {
              return next(err);
            }
            QB
            .forModel('Home')
            .populate(populateAttributes)
            .findByUuid(req.params.uuid)
            .fetch()
            .then((newResult) => {
              res.json({
                status: 'ok',
                home: exposeHome(newResult.home, req.version)
              });
            })
            .catch(next);
          });
        })
        .catch(next);
        return;
      }

      res.json({
        status: 'ok',
        home: exposeHome(result.home, req.version)
      });
    })
    .catch(next);
  });

  /**
   * @api {put} /api/homes/:id Update home
   * @apiVersion 1.0.1
   * @apiName UpdateHome
   * @apiGroup Homes
   * @apiDescription Update home by uuid
   *
   * @apiUse MobileRequestHeaders
   * @apiUse HomeBody
   * @apiUse HomeSuccessResponse
   * @apiUse HomeSuccessResponseJSON
   * @apiUse UserSuccessResponseJSON
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "ok",
   *       "home": {...}
   *     }
   *
   */
  app.put('/api/homes/:uuid', app.authenticatedRoute, function(req, res, next) {
    debug('API update home with uuid', req.params.uuid);
    debug('req.body', req.body);

    let data = req.body.home;

    // Force enable the home for now, if not set by client
    if (!data.hasOwnProperty('enabled')) {
      data.enabled = true;
    }

    updateHome(req.user, req.params.uuid, data)
    .then((model) => {
      res.json({
        status: 'ok',
        home: exposeHome(model, req.version)
      });
    })
    .catch(next);
  });

  /**
   * @api {post} /api/homes Create a home
   * @apiVersion 1.0.1
   * @apiName CreateHome
   * @apiGroup Homes
   *
   * @apiUse MobileRequestHeaders
   * @apiUse HomeBody
   * @apiUse HomeSuccessResponse
   * @apiUse HomeSuccessResponseJSON
   * @apiUse UserSuccessResponseJSON
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "ok",
   *       "home": {...}
   *     }
   */
  app.post('/api/homes', app.authenticatedRoute, function(req, res, next) {
    debug('API create home');

    QB
    .forModel('Home')
    .query({
      createdBy: req.user
    })
    .populate(populateAttributes)
    .findOne()
    .fetch()
    .then((result) => {
      res.json({
        status: 'ok',
        home: exposeHome(result.model, req.version)
      });
    })
    .catch((err) => {
      if (!err instanceof NotFound) {
        next(err);
      }
      QB
      .forModel('Home')
      .populate(populateAttributes)
      .createNoMultiset({
        enabled: false,
        createdBy: req.user
      })
      .then((model) => {
        res.json({
          status: 'ok',
          home: exposeHome(model, req.version)
        });
      })
      .catch(next);
    });
  });

  /**
   * @api {delete} /api/homes/:id Delete home
   * @apiVersion 1.0.1
   * @apiName DeleteHome
   * @apiGroup Homes
   * @apiDescription Deletes the given home
   *
   * @apiParam {String} id Home's internal id
   *
   * @apiUse MobileRequestHeaders
   * @apiUse HomeSuccessResponse
   * @apiUse HomeSuccessResponseJSON
   * @apiUse UserSuccessResponseJSON
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "deleted",
   *       "home": {...}
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
        home: exposeHome(result.model, req.version)
      });
    })
    .catch(next);
  });

  /**
   * @api {put} /api/homes/:id/like Like/Unlike home
   * @apiVersion 1.0.1
   * @apiName LikeHome
   * @apiGroup Homes
   * @apiPermission authenticated
   * @apiDescription Like or Unlike home by uuid
   *
   * @apiParam {String} id Home's internal id
   *
   * @apiUse MobileRequestHeadersAuthenticated
   * @apiUse StateSuccessResponse
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "ok",
   *       "state": {...}
   *     }
   *
   */
  app.put('/api/homes/:uuid/like', app.authenticatedRoute, function(req, res, next) {
    debug('API like home with uuid', req.params.uuid, 'with user', req.user.id);

    QB
    .forModel('Home')
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {
      result.model.updateActionState('like', req.user)
      .then((results) => {
        let returnObject = {
          status: 'ok',
          state: {
            type: 'like',
            status: results.status
          }
        };
        returnObject = merge(returnObject, results.data);
        res.json(returnObject);
      })
      .catch(next);
    })
    .catch(next);
  });

};
