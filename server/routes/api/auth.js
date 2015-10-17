'use strict';

import QueryBuilder from '../../lib/QueryBuilder';
import {NotFound, BadRequest, Forbidden} from '../../lib/Errors';
import {randomString} from '../../lib/Helpers';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  function generateTokenAndRespond(res, user) {
    return new Promise((resolve, reject) => {
      let tokenData = app.authentication.createTokenForUser(user);

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
            expiresAt: tokenData.expiresAt,
            user: user
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
   * @apiSuccess {String} user.username     Username for the user, used in login
   *
   */

  /**
   * @api {post} /api/auth/login Login the Mobile User
   * @apiVersion 0.1.0
   * @apiName UserLogin
   * @apiGroup Authentication
   *
   * @apiUse MobileRequestHeaders
   * @apiParam {String} username    Username of the user
   * @apiParam {String} password    Password for the user (Mobile Device Id)
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
    if (!req.body.username || !req.body.password) {
      return next(new BadRequest('invalid request body'));
    }

    QB
    .forModel('User')
    .findByUsername(req.body.username)
    .fetch()
    .then((result) => {
      if (!result.user.active) {
        return next(new Forbidden('account disabled'));
      }

      if (!result.user.isValidPassword(req.body.password)) {
        return next(new Forbidden('invalid credentials'));
      }

      generateTokenAndRespond(res, result.user);
    })
    .catch(next);
  });

  /**
   * @api {post} /api/auth/register Register the Mobile User
   * @apiVersion 0.1.0
   * @apiName UserRegister
   * @apiGroup Authentication
   *
   * @apiUse MobileRequestHeaders
   * @apiParam {String} deviceId    Mobile Device Id
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
  app.post('/api/auth/register', function(req, res, next) {
    if (!req.body.deviceId) {
      return next(new BadRequest('invalid request body'));
    }

    let deviceIdData = {};
    let deviceType = 'ios';
    if (req.clientInfo.platform) {
      deviceType = req.clientInfo.platform.toLowerCase();
    }
    deviceIdData[deviceType] = req.body.deviceId;

    QB
    .forModel('User')
    .findByDeviceId(req.body.deviceId)
    .fetch()
    .then((result) => {
      if (!result.user.active) {
        return next(new Forbidden('account disabled'));
      }
      generateTokenAndRespond(res, result.user);
    })
    .catch((err) => {
      if (err instanceof NotFound) {
        let username = randomString(12);
        QB
        .forModel('User')
        .createNoMultiset({
          username: username,
          password: req.body.deviceId,
          deviceId: deviceIdData
        })
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

};
