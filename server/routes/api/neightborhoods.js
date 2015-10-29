import QueryBuilder from '../../lib/QueryBuilder';
// let debug = require('debug')('app');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  /**
   * @apiDefine NeighborhoodSuccessResponse
   * @apiVersion 0.1.0
   *
   * @apiSuccess {String} id                Uuid of the Neighborhood
   * @apiSuccess {String} title             Title of the Neighborhood
   * @apiSuccess {Datetime} createdAt       ISO-8601 Formatted Creation Datetime
   * @apiSuccess {Datetime} updatedAt       ISO-8601 Formatted Updation Datetime
   * @apiSuccess {Integer} createdAtTS      EPOCH formatted timestamp of the creation time
   * @apiSuccess {Integer} updatedAtTS      EPOCH formatted timestamp of the updation time
   *
   */

  /**
    * @apiDefine NeighborhoodBody
    * @apiVersion 0.1.0
    *
    * @apiParam {Object} neighborhood           Neighborhood object
    * @apiParam {String} neighborhood.title     Title of the Neighborhood
    *
    */

  /**
   * @api {get} /api/neighborhoods/:city Fetch All Neighborhood from city
   * @apiVersion 0.1.0
   * @apiName GetNeighborhoods
   * @apiGroup Neighborhoods
   *
   * @apiDescription Route for fetching Neighborhoods by city
   *
   * @apiUse MobileRequestHeaders
   * @apiUse NeighborhoodSuccessResponse
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       'status': 'ok',
   *       'neighborhoods': [...]
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
   * @apiVersion 0.1.0
   * @apiName GetNeighborhoodBySlug
   * @apiGroup Neighborhoods
   *
   * @apiDescription Route for fetching Neighborhood by city and slug
   *
   * @apiUse MobileRequestHeaders
   * @apiUse NeighborhoodSuccessResponse
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       'status': 'ok',
   *       'neighborhood': {...}
   *     }
   *
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
