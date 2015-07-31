'use strict';

import alt from '../../common/alt';
import HomeActions from '../actions/HomeActions';

let debug = require('../../common/debugger')('HomeStore');

class HomeStore {
  constructor() {
    this.bindListeners({
      handleUpdateHome: HomeActions.UPDATE_HOME,
      handleFetchHome: HomeActions.FETCH_HOME,
      handleFetchFailed: HomeActions.FETCH_FAILED
    });

    this.home = null;
    this.error = null;
  }

  handleUpdateHome(home) {
    debug('handleUpdateHome', home);
    this.home = home;
    this.error = null;
  }
  handleFetchHome() {
    debug('handleFetchHome');
    this.home = null;
    this.error = null;
  }
  handleFetchFailed(error) {
    debug('handleFetchFailed', error);
    this.error = error;
  }
}

module.exports = alt.createStore(HomeStore);
