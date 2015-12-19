import alt from '../../common/alt';
import AuthActions from '../actions/AuthActions';
import AuthSource from '../sources/AuthSource';

// let debug = require('../debugger')('AuthStore');

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
    this.user = user;
    this.error = null;
  }
  handleFetchUser(args) {
    this.user = null;
    this.error = null;
  }
  handleFetchFailed(error) {
    this.error = error;
    this.user = null;
  }
}

module.exports = AuthStore;
