import alt from '../../common/alt';

let debug = require('../../common/debugger')('HomeListActions');

@alt.createActions
class HomeListActions {
  updateHomes(homes) {
    this.dispatch(homes);
  }
  fetchHomes(skipCache) {
    debug('fetchHomes', skipCache);
    this.dispatch(skipCache);
  }
  fetchFailed(error) {
    debug('fetchFailed', error);
    this.dispatch(error);
  }
}

module.exports = HomeListActions;
