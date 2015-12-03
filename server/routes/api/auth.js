import QueryBuilder from '../../lib/QueryBuilder';
import {NotFound, BadRequest, Forbidden} from '../../lib/Errors';
import {randomString} from '../../lib/Helpers';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  function generateTokenAndRespond(res, user) {
    return new Promise((resolve, reject) => {
      let tokenData = app.authentication.createTokenForUser(user);

      let userJson = user.toJSON();
      delete userJson.username;
      delete userJson.metadata;
      delete userJson.name;
      delete userJson.rname;
      delete userJson.deviceId;
      delete userJson.active;
      if (userJson.displayName === user.username || userJson.displayName === user.email) {
        userJson.displayName = '';
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
          }
        });
      })
      .catch(reject);
    });
  }

  /**
   * @apiDefine AuthSuccessResponse
   * @apiVersion 0.1.0
   *
   * @apiSuccess {String} token             Authentication token for the user
   * @apiSuccess {Number} expiresIn         Expiration time in seconds
   * @apiSuccess {Datetime} expiresAt       ISO-8601 Formatted Expiration Datetime
   * @apiSuccess {Object} user              User details
   * @apiSuccess {String} user.id           Internal Id of the user
   * @apiSuccess {String} user.email        Users email
   * @apiSuccess {String} user.displayName  Users fullname
   * @apiSuccess {String} user.firstname    Users firstname
   * @apiSuccess {String} user.lastname     Users lastname
   *
   */

  /**
   * @api {post} /api/auth/login Login the Mobile User
   * @apiVersion 0.1.0
   * @apiName UserLogin
   * @apiGroup Authentication
   *
   * @apiUse MobileRequestHeaders
   * @apiParam {String} service     Name of the external service. Enum[facebook, google]
   * @apiParam {Object} user        Details of the user
   * @apiParam {String} user.id              Users Id from the service
   * @apiParam {String} user.email           Users email from the service
   * @apiParam {String} user.token           Users token from the service
   * @apiParam {String} user.displayName     Users Fullname from the service
   * @apiUse AuthSuccessResponse
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       'status': 'ok',
   *       'session': {...}
   *     }
   *
   * @apiError (400) BadRequest Invalid request body, missing parameters.
   * @apiError (403) Forbidden  User account has been disabled
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 403 Forbidden
   *     {
   *       'status': 'failed',
   *       'error': 'account disabled'
   *     }
   */
  app.post('/api/auth/login', function(req, res, next) {
    //console.log('login/register', req.clientInfo, req.body);

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
      generateTokenAndRespond(res, result.user);
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

        QB
        .forModel('User')
        .createNoMultiset(userData)
        .then((model) => {
          generateTokenAndRespond(res, model);
        })
        .catch(next);
      } else {
        next(err);
      }
    });
  });

  /**
   * @api {post} /api/auth/register/push Register/Unregister Mobile Client for Push
   * @apiVersion 0.1.0
   * @apiName PushRegister
   * @apiGroup Authentication
   *
   * @apiDescription When given a valid pushToken, registers the device to receive push notifications. Otherwise unregisters the device.
   *
   * @apiPermission authenticated
   * @apiUse MobileRequestHeaders
   * @apiParam {String} pushToken    Push token for mobile client
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       'status': 'ok'
   *     }
   *
   * @apiError (400) BadRequest Invalid request body, missing parameters.
   * @apiError (403) Forbidden  User account has been disabled
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 403 Forbidden
   *     {
   *       'status': 'failed',
   *       'error': 'account disabled'
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
   * @api {put} /api/auth/user Update user details
   * @apiVersion 0.1.0
   * @apiName UpdateUser
   * @apiGroup Authentication
   *
   * @apiDescription Possibility to update users nickname only currently.
   *
   * @apiPermission authenticated
   * @apiUse MobileRequestHeaders
   * @apiParam {Object} user              User details
   * @apiParam {String} user.nickname    Nickname for user
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       'status': 'ok',
   *       'user': {...}
   *     }
   *
   * @apiError (400) BadRequest Invalid request body, missing parameters.
   * @apiError (403) Forbidden  User account has been disabled
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 403 Forbidden
   *     {
   *       'status': 'failed',
   *       'error': 'account disabled'
   *     }
   */
  app.put('/api/auth/user', app.authenticatedRoute, function(req, res, next) {
    if (!req.body.user) {
      return next(new BadRequest('invalid request body'));
    }

    let data = req.body.user;

    if (!data.nickname) {
      return next(new BadRequest('invalid request body'));
    }

    QB
    .forModel('User')
    .findById(req.user.id)
    .update(data)
    .then((user) => {
      res.json({
        status: 'ok', user: user
      });
    })
    .catch(next);
  });

  /**
   * @api {get} /api/auth/check Check session validity
   * @apiVersion 0.1.0
   * @apiName CheckSessionValidity
   * @apiGroup Authentication
   *
   * @apiDescription Allows for checking wether the session is valid or not
   *
   * @apiPermission authenticated
   * @apiUse MobileRequestHeaders
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       'status': 'ok'
   *     }
   *
   * @apiError (403) Forbidden  User account has been disabled
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 403 Forbidden
   *     {
   *       'status': 'failed',
   *       'error': 'account disabled'
   *     }
   */
  app.get('/api/auth/check', app.authenticatedRoute, function(req, res, next) {
    if (!req.user) {
      return next(new Forbidden('invalid request'));
    }
    res.json({status: 'ok'});
  });

};
