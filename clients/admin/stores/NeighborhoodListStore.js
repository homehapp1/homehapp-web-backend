'use strict';

import alt from '../../common/alt';
import NeighborhoodListActions from '../actions/NeighborhoodListActions';
import NeighborhoodListSource from '../sources/NeighborhoodListSource';
// import Cache from '../../common/Cache';

let debug = require('../../common/debugger')('NeighborhoodListStore');

@alt.createStore
class NeighborhoodListStore {
  constructor() {
    this.on('bootstrap', () => {
      debug('bootstrapping', this.neighborhoods);
    });

    this.bindListeners({
      handleUpdateNeighborhoods: NeighborhoodListActions.UPDATE_NEIGHBORHOODS,
      handleFetchNeighborhoods: NeighborhoodListActions.FETCH_NEIGHBORHOODS,
      handleFetchFailed: NeighborhoodListActions.FETCH_FAILED
    });

    this.neighborhoods = [];
    this.error = null;

    this.exportPublicMethods({
      getNeighborhood: this.getNeighborhood
    });

    this.exportAsync(NeighborhoodListSource);
  }

  getNeighborhood(id) {
    debug('getNeighborhood', id);
    let { neighborhoods } = this.getState();
    for (let neighborhood of neighborhoods) {
      if (neighborhood.id === id) {
        return neighborhood;
      }
    }
    return null;
  }

  handleUpdateNeighborhoods(neighborhoods) {
    debug('handleUpdateNeighborhoods', neighborhoods);
    this.neighborhoods = neighborhoods;
    this.error = null;
  }
  handleFetchNeighborhoods() {
    debug('handleFetchNeighborhoods');
    this.neighborhoods = [];
    this.error = null;
  }
  handleFetchFailed(error) {
    debug('handleFetchFailed', error);
    this.error = error;
  }
}

module.exports = NeighborhoodListStore;
