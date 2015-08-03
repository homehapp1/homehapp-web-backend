'use strict';

import alt from '../../common/alt';
import AuthActions from '../actions/AuthActions';
import AuthSource from '../sources/AuthSource';

let debug = require('../debugger')('AuthStore');

@alt.createStore
class AuthStore {
  constructor() {
    this.bindListeners({
      handleUpdateUser: AuthActions.UPDATE_USER,
      handleFetchUser: AuthActions.FETCH_USER,
      handleFetchFailed: AuthActions.FETCH_FAILED
    });

    this.user = null;
    this.error = null;
    this.loggedIn = false;

    this.exportAsync(AuthSource);
  }

  handleUpdateUser(user) {
    debug('handleUpdateUser', user);
    this.user = user;
    this.error = null;
  }
  handleFetchUser() {
    debug('handleFetchUser');
    this.user = null;
    this.error = null;
  }
  handleFetchFailed(error) {
    debug('handleFetchFailed', error);
    this.error = error;
  }
}

module.exports = AuthStore;
