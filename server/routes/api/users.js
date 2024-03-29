import QueryBuilder from '../../lib/QueryBuilder';
import {NotFound, BadRequest, Forbidden} from '../../lib/Errors';
import {randomString, exposeHome, exposeUser} from '../../lib/Helpers';

let debug = require('debug')('API: /api/auth/user');

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  /**
   * @apiDefine UserSuccessResponse
   * @apiVersion 1.0.1
   *
   * @apiSuccess {Object} user          User details
   * @apiSuccess {String} user.id        Internal Id of the user
   * @apiSuccess {String} user.email      User's email
   * @apiSuccess {String} user.displayName  User's fullname
   * @apiSuccess {String} user.firstname   User's firstname
   * @apiSuccess {String} user.lastname    User's lastname
   * @apiSuccess {Object} user.profileImage User's profile image as an <a href="#api-Shared-Images">Image</a> object
   * @apiSuccess {Object} user.contact                  User's contact information
   * @apiSuccess {Object} user.contact.address          Address information
   * @apiSuccess {String} user.contact.address.street   User's street address (only for the authenticated user)
   * @apiSuccess {String} user.contact.address.city     User's city
   * @apiSuccess {String} user.contact.address.zipcode  User's post office code
   * @apiSuccess {String} user.contact.address.country  User's country
   * @apiSuccess {String} user.contact.phone            User's phone number
   */

  /**
   * @apiDefine UserSuccessResponseJSON
   * @apiVersion 1.0.1
   *
   * @apiSuccessExample {json} JSON serialization of the user
   *     "user": {
   *       "id": "...",
   *       "email": "...",
   *       "displayName": "...",
   *       "firstname": "...",
   *       "lastname": "...",
   *       "profileImage": {
   *         "url": "...",
   *         "alt": "...",
   *         "width": ...,
   *         "height": ...
   *       },
   *       "contact": {
   *         "address": {
   *           "street": "...",
   *           "city": "...",
   *           "zipcode": "...",
   *           "country": "..."
   *         },
   *         "phone": "..."
   *       }
   *     }
   */

  /**
   * @apiDefine UserBody
   * @apiVersion 1.0.1
   *
   * @apiParam {String} [user.email]     User's email address
   * @apiParam {String} [user.firstname] User's firstname
   * @apiParam {String} [user.lastname]  User's lastname
   * @apiParam {Object} [user.profileImage] User's profile <a href="#api-Shared-Images">Image</a>
   * @apiParam {Object} [user.contact]   User's contact information
   * @apiParam {Object} [user.contact.address]          User's address information
   * @apiParam {String} [user.contact.address.street]   User's street address
   * @apiParam {String} [user.contact.address.city]   User's street address
   * @apiParam {String} [user.contact.address.zipcode]   User's street address
   * @apiParam {String} [user.contact.address.country]   User's street address
   * @apiParam {String} [user.contact.phone]     User's phone number
   *
   * @apiParamExample {json} Request-example
   *     {
   *       "user": {
   *         "email": "mr.developer@example.net",
   *         "firstname": "Test",
   *         "lastname": "Tester",
   *         "profileImage": {
   *           "url": "https://lh3.googleusercontent.com/-1NSytNuggHM/VDp8UrP5dpI/AAAAAAAAAHk/Ds4khe_1Eoo/w214-h280-p/self-portrait.jpg",
   *           "alt": "Testi Testiikkeli",
   *           "width": 214,
   *           "height": 280
   *         },
   *         "contact": {
   *           "address": {
   *             "street": "Examplestreet",
   *             "city": "Exampleville",
   *             "zipcode": "01234",
   *             "country": "EX"
   *           },
   *           "phone": "+1 23 456 7890"
   *         }
   *       }
   *     }
   */

  /**
   * @api {any} /api/* User details
   * @apiVersion 1.0.1
   * @apiName UserData
   * @apiGroup Users
   *
   * @apiDescription User details for each response that has the user object contains the same set of data
   * @apiUse UserSuccessResponse
   * @apiUse UserSuccessResponseJSON
   */

  /**
   * @api {get} /api/auth/user
   * @apiVersion 1.0.1
   * @apiName GetUser
   * @apiGroup Users
   *
   * @apiDescription Get the details of the current user
   * @apiPermission authenticated
   * @apiUse MobileRequestHeadersAuthenticated
   * @apiUse UserSuccessResponse
   * @apiUse UserSuccessResponseJSON
   *
   * @apiError (403) Forbidden  User account has been disabled or not logged in
   * @apiErrorExample Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *     "status": "failed",
   *     "error": "account disabled"
   *    }
   */
  app.get('/api/auth/user', app.authenticatedRoute, function(req, res, next) {
    debug('User ID', req.user.id);
    let user = null;

    QB
    .forModel('User')
    .findById(req.user.id)
    .fetch()
    .then((result) => {
      user = result.model;
      debug('foobar');

      QB
      .forModel('Home')
      .query({
        createdBy: user
      })
      .populate({
        createdBy: {},
        updatedBy: {}
      })
      .findOne()
      .fetch()
      .then((result) => {
        res.json({
          status: 'ok',
          user: exposeUser(user, req.version, user),
          home: exposeHome(result.model, req.version, user)
        });
      })
      .catch((err) => {
        res.json({
          status: 'ok',
          user: exposeUser(user, req.version, user),
          home: null
        });
      });
    })
    .catch(next);
  });

  /**
   * @api {put} /api/auth/user Update user details
   * @apiVersion 1.0.1
   * @apiName UpdateUser
   * @apiGroup Users
   *
   * @apiDescription Update user details
   *
   * @apiPermission authenticated
   * @apiUse MobileRequestHeadersAuthenticated
   * @apiUse UserSuccessResponse
   * @apiUse UserSuccessResponseJSON
   * @apiUse UserBody
   *
   * @apiError (400) BadRequest Invalid request body, missing parameters.
   * @apiError (403) Forbidden  User account has been disabled
   * @apiErrorExample Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *     "status": "failed",
   *     "error": "account disabled"
   *    }
   */
  app.put('/api/auth/user', app.authenticatedRoute, function(req, res, next) {
    if (!req.body.user) {
      return next(new BadRequest('invalid request body'));
    }

    let data = req.body.user;
    delete data.id;

    QB
    .forModel('User')
    .findById(req.user.id)
    .update(data)
    .then((user) => {
      res.json({
        status: 'ok',
        user: exposeUser(user)
      });
    })
    .catch(next);
  });
};
