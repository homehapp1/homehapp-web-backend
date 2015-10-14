'use strict';

import alt from '../../common/alt';

// let debug = require('../../common/debugger')('NeighborhoodListActions');

@alt.createActions
class NeighborhoodListActions {
  updateNeighborhoods(neighborhoods) {
    this.dispatch(neighborhoods);
  }
  fetchNeighborhoods(skipCache) {
    // debug('fetchNeighborhoods', skipCache);
    this.dispatch(skipCache);
  }
  fetchFailed(error) {
    debug('fetchFailed', error);
    this.dispatch(error);
  }
}

module.exports = NeighborhoodListActions;
