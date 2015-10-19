

import passport from 'passport';
import http from 'http';
//import moment from 'moment';

import Helpers from '../../Helpers';
import QueryBuilder from '../../QueryBuilder';

class AuthenticationMiddleware {
  constructor(app, config) {
    this.app = app;
    this.config = Helpers.merge({}, config);

    this.authentication = passport;

    this.sessionStore = null;
  }
  register() {
    let self = this;

    const QB = new QueryBuilder(this.app);

    this.app.authenticatedRoute = [];

    http.IncomingMessage.prototype.isUserActive = function () {
      if (!this.isAuthenticated()) {
        return false;
      }
      return this.user.active;
    };

    this.app.use(function autoSignedHelperMiddleware(req, res, next) {
      if (self.authentication._autoSignedUser) {
        req.user = self.authentication._autoSignedUser;
      }
      next();
    });

    this.authentication.serializeUser((user, done) => {
      done(null, user.id);
    });
    this.authentication.deserializeUser((id, done) => {
      QB
      .forModel('User')
      .findById(id)
      .fetch()
      .then((result) => {
        if (!result.user) {
          return done(new Error('user not found'));
        }
        done(null, result.user);
      })
      .catch(done);
    });

    // Registering each enabled adapter
    this.config.adapters.forEach((adapterName) => {
      let adapter = null;
      let adapterPath = `${__dirname}/adapters/${adapterName}`;
      try {
        adapter = require(adapterPath);
      } catch (err) {
        this.app.log.error(
          `Adapter ${adapterName} not found from path ${adapterPath}!`, err
        );
      }
      if (adapter) {
        adapter.register(this, this.app, this.config.adapterConfigs[adapterName] || {});
      }
    });

    this.app.use(this.authentication.initialize());
    if (this.sessionStore) {
      this.app.use(this.authentication.session());
    }

    this.authentication.resolveLoginMethod = this.resolveLoginMethod.bind(this);

    return this.authentication;
  }
  /**
   * @param req Request
   */
  resolveLoginMethod() {
    let loginMethod = 'local';

    if (this.config.adapters.indexOf(loginMethod) === -1) {
      return null;
    }

    return loginMethod;
  }
}

module.exports = AuthenticationMiddleware;
