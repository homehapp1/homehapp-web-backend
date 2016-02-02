import QueryBuilder from '../../lib/QueryBuilder';
import {BadRequest} from '../../lib/Errors';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  let populateAttributes = {
    'location.city': {}
  };

  /**
   * @apiDefine NeighborhoodSuccessResponse
   * @apiVersion 1.0.1
   *
   * @apiSuccess {String} id        UUID of the neighborhood
   * @apiSuccess {String} title     Title of the Neighborhood
   * @apiSuccess {Array} aliases    Different names that the neighborhood is known
   * @apiSuccess {String} description Free textual description of the neighborhood
   * @apiSuccess {Array} homes      An array of <a href="#api-Homes-GetHomeById">Home</a> objects of the neighborhood
   * @apiSuccess {Object} location              Location of the neighborhood
   * @apiSuccess {String} location.borough      Borough of the neighborhood
   * @apiSuccess {Array} location.postCodes     Postcodes of the neighborhood
   * @apiSuccess {String} location.postOffice   Post office of the neighborhood
   * @apiSuccess {Object} location.city         City object related to the neighborhood
   * @apiSuccess {Array} location.coordinates   Center coordinates for the neighborhood [latitude, longitude]
   * @apiSuccess {Array} area       Area as coordinate pairs, e.g. for drawing the neighborhood area polygon on a map
   * @apiSuccess {Boolean} story.enabled  Switch for enabling/disabling the public viewing of the neighborhood story
   * @apiSuccess {Array} story.blocks     An array of <a href="#api-Shared-StoryBlock">StoryBlocks</a>
   * @apiSuccess {Array} images     An array of <a href="#api-Shared-Images">Images</a>
   * @apiSuccess {Boolean} visible  Should the neighborhood be visible in the listings
   * @apiSuccess {Datetime} createdAt       ISO-8601 Formatted Creation Datetime
   * @apiSuccess {Datetime} updatedAt       ISO-8601 Formatted Updation Datetime
   * @apiSuccess {Integer} createdAtTS      EPOCH formatted timestamp of the creation time
   * @apiSuccess {Integer} updatedAtTS      EPOCH formatted timestamp of the updation time
   */

   /**
    * @apiDefine NeighborhoodSuccessResponseJSON
    * @apiVersion 1.0.1
    *
    * @apiSuccessExample {json} JSON serialization of the neighborhood
    *     {
    *       "id": "...",
    *       "title": "...",
    *       "aliases: ["...", "..."],
    *       "description": "...",
    *       "homes": [{...}, {...}],
    *       "location": {
    *         "borough": "...",
    *         "postCodes": ["...", "..."],
    *         "postOffice": "...",
    *         "city": {...},
    *         "coordinates": [
    *           51.4321,
    *           -0.1234
    *         ],
    *       },
    *       "area": [
    *         {
    *           "lat": 51.4321,
    *           "lng": -0.1234
    *         },
    *         {
    *           "lat": 51.4321,
    *           "lng": -0.1234
    *         }
    *       ],
    *       "story": {
    *         "enabled": true,
    *         "blocks": {...}
    *       },
    *       "images": [{...}, {...}],
    *       "visible": true
    *     }
    */

  /**
    * @apiDefine NeighborhoodBody
    * @apiVersion 1.0.1
    *
    * @apiParam {Object} neighborhood                     Neighborhood object
    * @apiParam {Boolean} [neighborhood.enabled]          Switch for enabling/disabling the public viewing of the neighborhood
    * @apiParam {String} [neighborhood.title]             Title of the Neighborhood
    * @apiParam {String} [neighborhood.description]         Textual description of the neighborhood
    * @apiParam {Object} [neighborhood.location]            Location details
    * @apiParam {String} [neighborhood.location.borough]            Borough
    * @apiParam {Array} [neighborhood.location.postCodes]     Array of PostCode strings
    * @apiParam {String} [neighborhood.location.postOffice]  PostOffice
    * @apiParam {String} [neighborhood.location.city]       City
    * @apiParam {Array}  [neighborhood.location.coordinates]        Map coordinates. [LAT, LON]
    * @apiParam {Array}  [neighborhood.images]                  An array of <a href="#api-Shared-Images">Images</a>
    * @apiParam {Object} [neighborhood.story]                   Story block container object
    * @apiParam {Boolean} [neighborhood.story.enabled=false]    Switch to determine if the story is public
    * @apiParam {Array} [neighborhood.story.blocks]             An array of <a href="#api-Shared-StoryBlock">StoryBlocks</a>
    */

 /**
  * @api {get} /api/neighborhoods/my/:id Fetch users own Neighborhood by id
  * @apiVersion 1.0.1
  * @apiName GetMyNeighborhood
  * @apiGroup Neighborhoods
  * @apiPermission authenticated
  *
  * @apiDescription Route for fetching Users own Neighborhood by id
  *
  * @apiSuccess  {String} status         Textual status message for the request
  * @apiSuccess  {Object} neighborhood   <a href="#api-Neighborhoods-GetNeighborhoodBySlug">Neighborhood</a>
  *
  * @apiUse MobileRequestHeaders
  * @apiUse NeighborhoodSuccessResponseJSON
  *
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *       "status": "ok",
  *       "neighborhood": {...}
  *     }
  *
  */
  app.get('/api/neighborhoods/my/:uuid', app.authenticatedRoute, function (req, res, next) {
    QB
    .forModel('Neighborhood')
    .query({
      createdBy: req.user
    })
    .populate(populateAttributes)
    .findByUuid(req.params.uuid)
    .fetch()
    .then((result) => {
      let modelJson = result.model.toJSON();
      delete modelJson.updatedBy;
      delete modelJson.createdBy;
      res.json({
        status: 'ok',
        neighborhood: modelJson
      });
    })
    .catch(next);
  });

 /**
  * @api {put} /api/neighborhoods/my/:id Update users own Neighborhood by id
  * @apiVersion 1.0.1
  * @apiName UpdateMyNeighborhood
  * @apiGroup Neighborhoods
  * @apiPermission authenticated
  *
  * @apiDescription Route for updating Users own Neighborhood by id
  *
  * @apiSuccess  {String} status         Textual status message for the request
  * @apiSuccess  {Object} neighborhood   <a href="#api-Neighborhoods-GetNeighborhoodBySlug">Neighborhood</a>
  *
  * @apiUse MobileRequestHeaders
  * @apiUse NeighborhoodBody
  * @apiUse NeighborhoodSuccessResponseJSON
  *
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *       "status": "ok",
  *       "neighborhood": {...}
  *     }
  *
  */
  app.put('/api/neighborhoods/my/:uuid', app.authenticatedRoute, function (req, res, next) {
    if (!req.body.neighborhood) {
      return next(new BadRequest('invalid request body'));
    }

    QB
    .forModel('Neighborhood')
    .query({
      createdBy: req.user
    })
    .populate(populateAttributes)
    .findByUuid(req.params.uuid)
    .update(req.body.neighborhood)
    .then((model) => {
      let modelJson = model.toJSON();
      delete modelJson.updatedBy;
      delete modelJson.createdBy;
      res.json({
        status: 'ok',
        neighborhood: modelJson
      });
    })
    .catch(next);
  });

  /**
   * @api {get} /api/neighborhoods/:city Fetch All Neighborhood from city
   * @apiVersion 1.0.1
   * @apiName GetNeighborhoods
   * @apiGroup Neighborhoods
   *
   * @apiDescription Route for fetching Neighborhoods by city
   *
   * @apiSuccess  {String} status         Textual status message for the request
   * @apiSuccess  {Array} neighborhoods   An array of the <a href="#api-Neighborhoods-GetNeighborhoodBySlug">Neighborhoods</a> corresponding to the query
   *
   * @apiUse MobileRequestHeaders
   * @apiUse NeighborhoodSuccessResponseJSON
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "ok",
   *       "neighborhoods": [...]
   *     }
   *
   */
  app.get('/api/neighborhoods/:city', function(req, res, next) {
    let city = null;

    QB
    .forModel('City')
    .findBySlug(req.params.city)
    .fetch()
    .then((result) => {
      city = result.city;
      return QB
      .forModel('Neighborhood')
      .query({
        enabled: true,
        'location.city': city
      })
      .populate(populateAttributes)
      .findAll()
      .fetch();
    })
    .then((result) => {
      res.json({
        status: 'ok',
        neighborhoods: result.models
      });
    })
    .catch(next);
  });

  /**
   * @api {get} /api/neighborhoods/:city/:neighborhood Fetch City Neighborhood by slug
   * @apiVersion 1.0.1
   * @apiName GetNeighborhoodBySlug
   * @apiGroup Neighborhoods
   *
   * @apiDescription Route for fetching Neighborhood by city and slug
   *
   * @apiUse NeighborhoodSuccessResponse
   * @apiUse MobileRequestHeaders
   * @apiUse NeighborhoodSuccessResponse
   * @apiUse NeighborhoodSuccessResponseJSON
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "ok",
   *       "neighborhood": {...}
   *     }
   */
  app.get('/api/neighborhoods/:city/:neighborhood', function(req, res, next) {
    let city = null;
    let neighborhood = null;

    QB
    .forModel('City')
    .findBySlug(req.params.city)
    .fetch()
    .then((result) => {
      city = result.city;
      return QB
      .forModel('Neighborhood')
      .query({
        // 'location.city': city,
        slug: req.params.neighborhood
      })
      .populate(populateAttributes)
      .findAll()
      .fetch();
    })
    .then((result) => {
      if (result.models.length !== 1) {
        throw new Error('Neighborhood not found');
      }

      neighborhood = result.models[0];
      neighborhood.location.city = city;

      return QB
      .forModel('Home')
      .findByNeighborhood(neighborhood)
      .sort({
        'metadata.score': -1
      })
      .fetch();
    })
    .then((result) => {
      neighborhood.homes = result.models;
      res.json({
        status: 'ok',
        neighborhood: neighborhood
      });
    })
    .catch(next);
  });
};
