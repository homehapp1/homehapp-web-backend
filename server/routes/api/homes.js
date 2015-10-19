

import QueryBuilder from '../../lib/QueryBuilder';
let debug = require('debug')('/api/homes');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

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

};
