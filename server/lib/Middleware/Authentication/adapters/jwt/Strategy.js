import {Strategy} from 'passport-strategy';
import jwt from 'jsonwebtoken';
import fs from 'fs';

class JWTStrategy extends Strategy {
  constructor(options, verify) {
    if (typeof options === 'function') {
      verify = options;
      options = {};
    }

    if (!verify) {
      throw new TypeError('JWTStrategy requires a verify callback');
    }
    if (!options.secret && !(options.keys || options.keys.public)) {
      throw new TypeError('JWTStrategy requires secret or key');
    }

    super(options, verify);

    this.name = 'jwt';
    this._verify = verify;
    this._options = options;
    this._passRequestToCallback = options.passRequestToCallback;

    this._scheme = options.authScheme || 'JWT';
    this._tokenField = options.tokenField || 'X-Qvik-Auth-Token';
    this._secretOrKey = options.secret;
    if (options.keys.public) {
      this._secretOrKey = fs.readFileSync(options.keys.public);
    }

    this._verifOpts = {};

    if (options.issuer) {
      this._verifOpts.issuer = options.issuer;
    }

    if (options.audience) {
      this._verifOpts.audience = options.audience;
    }

    if (options.keys.public) {
      this._verifOpts.algorithm = 'RS256';
    }
  }

  authenticate(req/*, opts*/) {
    if (!req.headers || !req.headers[this._tokenField.toLowerCase()]) {
      return this.fail(403);
    }
    let token = req.headers[this._tokenField.toLowerCase()];

    let verified = (err, user, info) => {
      if (err) {
        return this.error(err);
      }
      if (!user) {
        return this.fail(info);
      }
      req.user = user;
      this.success(user, info);
    };

    jwt.verify(token, this._secretOrKey, this._verifOpts, (err, payload) => {
      if (err) {
        return this.fail(err);
      }
      if (this._passRequestToCallback) {
        this._verify(req, payload, verified);
      } else {
        this._verify(payload, verified);
      }
    });
  }
}

export default JWTStrategy;
