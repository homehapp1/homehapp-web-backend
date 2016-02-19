import alt from '../../common/alt';
import NeighborhoodActions from '../actions/NeighborhoodActions';
import NeighborhoodSource from '../sources/NeighborhoodSource';
import Cache from '../../common/Cache';

let debug = require('../../common/debugger')('NeighborhoodStore');

@alt.createStore
class NeighborhoodStore {
  constructor() {
    this.on('bootstrap', () => {
      if (this.neighborhood) {
        Cache.set('neighborhoodsBySlug', this.neighborhood.slug, this.neighborhood);
      }
    });

    this.bindListeners({
      handleUpdateNeighborhood: NeighborhoodActions.UPDATE_NEIGHBORHOOD,
      handleFetchNeighborhoodBySlug: NeighborhoodActions.FETCH_NEIGHBORHOOD_BY_SLUG,
      handleFetchFailed: NeighborhoodActions.FETCH_FAILED
    });

    this.neighborhood = null;
    this.error = null;

    // this.exportPublicMethods({
    //   getNeighborhood: this.getNeighborhood
    // });

    this.exportAsync(NeighborhoodSource);
  }

  handleUpdateNeighborhood(neighborhood) {
    this.neighborhood = neighborhood;
    this.error = null;
  }
  handleFetchNeighborhoodBySlug(/*slug*/) {
    debug('handleFetchNeighborhoodBySlug', arguments);
    this.neighborhood = null;
    this.error = null;
  }
  handleFetchFailed(error) {
    this.error = error;
  }
}

module.exports = NeighborhoodStore;
