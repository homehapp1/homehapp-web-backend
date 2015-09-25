'use strict';

import alt from '../../common/alt';
import NeighborhoodActions from '../actions/NeighborhoodActions';
import NeighborhoodSource from '../sources/NeighborhoodSource';
import Cache from '../../common/Cache';

let debug = require('../../common/debugger')('NeighborhoodStore');

@alt.createStore
class NeighborhoodStore {
  constructor() {
    this.on('bootstrap', () => {
      debug('bootstrapping', this.Neighborhood);
      if (this.Neighborhood) {
        Cache.set('NeighborhoodsBySlug', this.Neighborhood.slug, this.Neighborhood);
      }
    });

    this.bindListeners({
      handleUpdateNeighborhood: NeighborhoodActions.UPDATE_NEIGHBORHOODS,
      handleFetchNeighborhoodBySlug: NeighborhoodActions.FETCH_NEIGHBORHOODS_BY_SLUG,
      handleFetchFailed: NeighborhoodActions.FETCH_FAILED
    });

    this.Neighborhood = null;
    this.error = null;

    // this.exportPublicMethods({
    //   getNeighborhood: this.getNeighborhood
    // });

    this.exportAsync(NeighborhoodSource);
  }

  handleUpdateNeighborhood(Neighborhood) {
    debug('handleUpdateNeighborhood', Neighborhood);
    this.Neighborhood = Neighborhood;
    this.error = null;
  }
  handleFetchNeighborhoodBySlug(slug) {
    debug('handleFetchNeighborhoodBySlug', slug);
    this.Neighborhood = null;
    this.error = null;
  }
  handleFetchFailed(error) {
    debug('handleFetchFailed', error);
    this.error = error;
  }
}

module.exports = NeighborhoodStore;
