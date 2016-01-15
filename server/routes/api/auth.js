import QueryBuilder from '../../lib/QueryBuilder';
import {NotFound, BadRequest, Forbidden} from '../../lib/Errors';
import {randomString, exposeHome, exposeUser} from '../../lib/Helpers';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  let populateAttributes = {
    'location.neighborhood': {},
    createdBy: {},
    updatedBy: {}
  };

  function generateTokenAndRespond(req, res, user, home) {
    return new Promise((resolve, reject) => {
      let tokenData = app.authentication.createTokenForUser(user);

      let userJson = exposeUser(user, req.version, req.user);

      if (!home) {
        // No home provided, get by user id or create if not available
        QB
        .forModel('Home')
        .populate(populateAttributes)
        .query({
          createdBy: user
        })
        .findOne()
        .fetch()
        .then((result) => {
          generateTokenAndRespond(req, res, user, result.model);
        })
        .catch((err) => {
          QB
          .forModel('Home')
          .createNoMultiset({
            createdBy: user,
            enabled: false
          })
          .then((model) => {
            generateTokenAndRespond(req, res, user, model);
          });
        });

        return null;
      }

      QB
      .forModel('User')
      .findById(user.id)
      .setExtraData({
        _checkId: tokenData.checkId
      })
      .update({})
      .then(() => {
        res.json({
          status: 'ok',
          session: {
            token: tokenData.token,
            expiresIn: tokenData.expiresIn,
            expiresAt: tokenData.expiresAt || '',
            user: userJson
          },
          home: exposeHome(home, req.version, req.user)
        });
      })
      .catch(reject);
    });
  }

  /**
   * @apiDefine AuthSuccessResponse
   * @apiVersion 1.0.1
   *
   * @apiSuccess {Object} session
   * @apiSuccess {String} session.token             Authentication token for the user
   * @apiSuccess {Number} session.expiresIn         Expiration time in seconds
   * @apiSuccess {Datetime} session.expiresAt       ISO-8601 Formatted Expiration Datetime
   * @apiSuccess {Object} session.user              <a href="#api-Users-UserData">User</a> object
   * @apiSuccess {Object} home                      <a href="#api-Homes-GetHomeById">Home</a> object
   */

  /**
   * @apiDefine AuthSuccessResponseJSON
   * @apiVersion 1.0.1
   *
   * @apiSuccessExample Success-Response
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "ok",
   *       "session": {
   *         "token": "...",
   *         "expiresIn": ...,
   *         "expiresAt": '...',
   *         "user": {...}
   *       },
   *       "home": {...}
   *     }

   */

  /**
   * @api {post} /api/auth/login Login the Mobile User
   * @apiVersion 1.0.1
   * @apiName UserLogin
   * @apiGroup Authentication
   *
   * @apiUse MobileRequestHeadersUnauthenticated
   * @apiParam {String} service     Name of the external service. Enum[facebook, google]
   * @apiParam {Object} user        Details of the user
   * @apiParam {String} user.id              User's Id from the service
   * @apiParam {String} user.email           User's email from the service
   * @apiParam {String} user.token           User's token from the service
   * @apiParam {String} [user.displayName]   User's full name from the service
   * @apiParam {String} [user.firstname]     User's first name from the service
   * @apiParam {String} [user.lastname]      User's last name from the service
   * @apiUse AuthSuccessResponse
   * @apiUse AuthSuccessResponseJSON
   * @apiUse UserSuccessResponseJSON
   * @apiUse HomeSuccessResponseJSON
   *
   * @apiError (400) BadRequest Invalid request body, missing parameters.
   * @apiError (403) Forbidden  User account has been disabled
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 403 Forbidden
   *     {
   *       "status": "failed",
   *       "error": "account disabled"
   *     }
   */
  app.post('/api/auth/login', function(req, res, next) {
    let data = req.body.user;

    if (!req.clientInfo || !req.clientInfo.deviceID) {
      return next(new BadRequest('invalid request, no device info found'));
    }

    if (!req.body.service || !data.email || !data.id || !data.token) {
      return next(new BadRequest('invalid request body'));
    }

    let deviceIdData = {};
    let deviceType = 'ios';
    if (req.clientInfo.platform) {
      deviceType = req.clientInfo.platform.toLowerCase();
    }
    deviceIdData[deviceType] = req.clientInfo.deviceID;

    let query = {};
    let user = null;
    // Add this query to bound the user to current device
    //query[`deviceId.${deviceType}`] = req.clientInfo.deviceID;

    QB
    .forModel('User')
    .query(query)
    .findByServiceId(req.body.service, data.id)
    .fetch()
    .then((result) => {
      if (!result.user.active) {
        return next(new Forbidden('account disabled'));
      }
      generateTokenAndRespond(req, res, result.user);
    })
    .catch((err) => {
      if (err instanceof NotFound) {
        let serviceData = {};
        serviceData[req.body.service] = {
          id: data.id,
          token: data.token
        };

        let userData = {
          username: `${req.body.service}${data.id}`,
          email: data.email,
          //password: `${req.body.service}${data.id}`,
          deviceId: deviceIdData,
          _service: serviceData
        };

        if (data.displayName) {
          let firstname = '';
          let lastname = '';
          let parts = data.displayName.split(' ');
          firstname = parts[0];
          if (parts.length > 1) {
            lastname = data.displayName.substr(firstname.length + 1);
          }
          userData.firstname = firstname;
          userData.lastname = lastname;
        }

        if (data.firstname) {
          userData.firstname = data.firstname;
        }

        if (data.lastname) {
          userData.lastname = data.lastname;
        }

        QB
        .forModel('User')
        .createNoMultiset(userData)
        .then((model) => {
          generateTokenAndRespond(req, res, model);
        })
        .catch(next);
      } else {
        next(err);
      }
    });
  });

  /**
   * @api {post} /api/auth/register/push Register/Unregister Mobile Client for Push
   * @apiVersion 1.0.1
   * @apiName PushRegister
   * @apiGroup Authentication
   *
   * @apiDescription When given a valid pushToken, registers the device to receive push notifications. Otherwise unregisters the device.
   *
   * @apiPermission authenticated
   * @apiUse MobileRequestHeadersAuthenticated
   * @apiParam {String} pushToken    Push token for mobile client
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "ok"
   *     }
   *
   * @apiError (400) BadRequest Invalid request body, missing parameters.
   * @apiError (403) Forbidden  User account has been disabled
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 403 Forbidden
   *     {
   *       "status": "failed",
   *       "error": "account disabled"
   *     }
   */
  app.post('/api/auth/register/push', app.authenticatedRoute, function(req, res, next) {
    if (!req.body.hasOwnProperty('pushToken')) {
      return next(new BadRequest('invalid request body'));
    }

    let tokenData = {};
    let deviceType = 'ios';
    if (req.clientInfo.platform) {
      deviceType = req.clientInfo.platform.toLowerCase();
    }
    tokenData[deviceType] = req.body.pushToken;

    QB
    .forModel('User')
    .findById(req.user.id)
    .fetch()
    .then((result) => {
      if (!result.user.active) {
        return next(new Forbidden('account disabled'));
      }

      QB
      .forModel('User')
      .findById(result.user.id)
      .setExtraData({
        pushToken: tokenData
      })
      .update({})
      .then(() => {
        res.send({
          status: 'ok'
        });
      })
      .catch(next);
    })
    .catch(next);
  });

  /**
   * @api {get} /api/auth/check Check session validity
   * @apiVersion 1.0.1
   * @apiName CheckSessionValidity
   * @apiGroup Authentication
   *
   * @apiDescription Allows for checking if the session is valid
   *
   * @apiPermission authenticated
   * @apiUse MobileRequestHeadersAuthenticated
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "ok"
   *     }
   *
   * @apiError (403) Forbidden  User account has been disabled
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 403 Forbidden
   *     {
   *       "status": "failed",
   *       "error": "account disabled"
   *     }
   */
  app.get('/api/auth/check', app.authenticatedRoute, function(req, res, next) {
    if (!req.user) {
      return next(new Forbidden('invalid request'));
    }
    res.json({status: 'ok'});
  });
};
