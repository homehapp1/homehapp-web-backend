


import QueryBuilder from '../../../../QueryBuilder';
import {generateUUID} from '../../../../Helpers';
import JWTStrategy from './Strategy';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import moment from 'moment';

// let debug = require('debug')('Authentication:JWTAdapter');

exports.register = function (parent, app, config) {
  const QB = new QueryBuilder(app);
  parent.authentication.use('jwt', new JWTStrategy(config, (payload, done) => {
    //debug('passport:jwt', payload);

    QB
    .forModel('User')
    .query({
      active: true
    })
    .findByUsername(payload.username)
    .fetch()
    .then((result) => {
      if (!result.user) {
        return done(null, false, { message: 'unknown user' });
      }

      if (result.user.uuid !== payload.uuid) {
        return done(null, false, { message: 'invalid token' });
      }

      if (config.checkIdField) {
        if (QB.forModel('User').hasSchemaField(config.checkIdField)) {
          let value = result.user.get(config.checkIdField);
          if (value !== payload.checkId) {
            return done(null, false, { message: 'invalid token' });
          }
        }
      }

      // TODO: Handle this through QB also
      // result.user.set({
      //   _lastLogin: moment().utc().toDate()
      // });
      // result.user.save();

      done(null, result.user);
    })
    .catch(done);
  }));

  app.authenticatedRoute.push(function(req, res, next) {
    parent.authentication.authorize('jwt', {session: false})(req, res, next);
  });

  parent.authentication.createTokenForUser = function createTokenForUser(user) {
    let expiresIn = config.lifetimeSeconds;
    let expiresAt = null;

    let checkId = generateUUID();

    let payload = {
      username: user.username,
      uuid: user.uuid,
      checkId: checkId
    };

    let tokenConfig = {};

    if (expiresIn > 0) {
      expiresAt = moment().add(expiresIn, 'seconds');
      tokenConfig.expiresInSeconds = expiresIn;
    }

    if (config.issuer) {
      tokenConfig.issuer = config.issuer;
    }
    if (config.audience) {
      tokenConfig.audience = config.audience;
    }

    let secretOrKey = config.secret;
    if (config.keys.public) {
      secretOrKey = this._secretOrKey = fs.readFileSync(config.keys.private);
      tokenConfig.algorithm = 'RS256';
    }

    let token = jwt.sign(payload, secretOrKey, tokenConfig);

    return {
      token: token,
      checkId: checkId,
      expiresAt: expiresAt,
      expiresIn: expiresIn
    };
  };
};
