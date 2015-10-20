import alt from '../../common/alt';

let debug = require('../../common/debugger')('NeighborhoodActions');

@alt.createActions
class NeighborhoodActions {
  updateNeighborhood(Neighborhood) {
    this.dispatch(Neighborhood);
  }
  fetchNeighborhoodBySlug(slug, skipCache) {
    debug('fetchNeighborhoodBySlug', slug, skipCache);
    this.dispatch(slug, skipCache);
  }
  fetchFailed(error) {
    debug('fetchFailed', error);
    this.dispatch(error);
  }
}

module.exports = NeighborhoodActions;
