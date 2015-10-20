import alt from '../../common/alt';
import NeighborhoodListActions from '../actions/NeighborhoodListActions';
import NeighborhoodListSource from '../sources/NeighborhoodListSource';
// import Cache from '../../common/Cache';

let debug = require('../../common/debugger')('NeighborhoodListStore');

@alt.createStore
class NeighborhoodListStore {
  constructor() {
    this.on('bootstrap', () => {
      debug('bootstrapping', this.Neighborhoods);
    });

    this.bindListeners({
      handleUpdateNeighborhoods: NeighborhoodListActions.UPDATE_NEIGHBORHOODS,
      handleFetchNeighborhoods: NeighborhoodListActions.FETCH_NEIGHBORHOODS,
      handleFetchFailed: NeighborhoodListActions.FETCH_FAILED
    });

    this.Neighborhoods = [];
    this.error = null;

    this.exportPublicMethods({
      getNeighborhood: this.getNeighborhood
    });

    this.exportAsync(NeighborhoodListSource);
  }

  getNeighborhood(id) {
    debug('getNeighborhood', id);
    let { Neighborhoods } = this.getState();
    for (let Neighborhood of Neighborhoods) {
      if (Neighborhood.id === id) {
        return Neighborhood;
      }
    }
    return null;
  }

  handleUpdateNeighborhoods(Neighborhoods) {
    debug('handleUpdateNeighborhoods', Neighborhoods);
    this.Neighborhoods = Neighborhoods;
    this.error = null;
  }
  handleFetchNeighborhoods() {
    debug('handleFetchNeighborhoods');
    this.Neighborhoods = [];
    this.error = null;
  }
  handleFetchFailed(error) {
    debug('handleFetchFailed', error);
    this.error = error;
  }
}

module.exports = NeighborhoodListStore;
