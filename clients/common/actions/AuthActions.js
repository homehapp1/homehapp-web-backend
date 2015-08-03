'use strict';

import alt from '../../common/alt';

let debug = require('../../common/debugger')('AuthActions');

@alt.createActions
class AuthActions {
  updateUser(user) {
    this.dispatch(user);
  }
  fetchUser() {
    debug('fetchUser');
    this.dispatch();
  }
  fetchFailed(error) {
    debug('fetchFailed', error);
    this.dispatch(error);
  }
}

module.exports = AuthActions;
