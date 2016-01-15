import QueryBuilder from '../../lib/QueryBuilder';
import {NotFound, BadRequest, Forbidden} from '../../lib/Errors';
import {randomString} from '../../lib/Helpers';

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
   * @apiParam {String} [user.contact.address]   User's street address
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

    QB
    .forModel('User')
    .findById(req.user.id)
    .update(data)
    .then((user) => {
      res.json({
        status: 'ok',
        user: user
      });
    })
    .catch(next);
  });
};
