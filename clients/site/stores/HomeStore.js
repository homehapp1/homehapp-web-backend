'use strict';

import alt from '../../common/alt';
import HomeActions from '../actions/HomeActions';
import HomeSource from '../sources/HomeSource';

let debug = require('../../common/debugger')('HomeStore');

@alt.createStore
class HomeStore {
  constructor() {
    this.bindListeners({
      handleUpdateHome: HomeActions.UPDATE_HOME,
      handleFetchHomeBySlug: HomeActions.FETCH_HOME_BY_SLUG,
      handleFetchFailed: HomeActions.FETCH_FAILED
    });

    this.home = null;
    this.error = null;

    // this.exportPublicMethods({
    //   getHome: this.getHome
    // });

    this.exportAsync(HomeSource);
  }

  handleUpdateHome(home) {
    debug('handleUpdateHome', home);
    this.home = home;
    this.error = null;
  }
  handleFetchHomeBySlug(slug) {
    debug('handleFetchHomeBySlug', slug);
    this.home = null;
    this.error = null;
  }
  handleFetchFailed(error) {
    debug('handleFetchFailed', error);
    this.error = error;
  }
}

module.exports = HomeStore;
