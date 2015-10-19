

import alt from '../../common/alt';

let debug = require('../../common/debugger')('HomeActions');

@alt.createActions
class HomeActions {
  updateHome(home) {
    this.dispatch(home);
  }
  fetchHomeBySlug(slug, skipCache) {
    debug('fetchHomeBySlug', slug, skipCache);
    this.dispatch(slug, skipCache);
  }
  fetchFailed(error) {
    debug('fetchFailed', error);
    this.dispatch(error);
  }
}

module.exports = HomeActions;
