

import alt from '../../common/alt';
import NeighborhoodActions from '../actions/NeighborhoodActions';
import NeighborhoodSource from '../sources/NeighborhoodSource';
// import Cache from '../../common/Cache';

let debug = require('../../common/debugger')('NeighborhoodStore');

@alt.createStore
class NeighborhoodStore {
  constructor() {
    this.on('bootstrap', () => {
      debug('bootstrapping', this.neighborhood);
    });

    this.bindListeners({
      handleCreateItem: NeighborhoodActions.CREATE_ITEM,
      handleUpdateItem: NeighborhoodActions.UPDATE_ITEM,
      handleRequestFailed: NeighborhoodActions.REQUEST_FAILED,
      handleCreateSuccess: NeighborhoodActions.CREATE_SUCCESS,
      handleUpdateSuccess: NeighborhoodActions.UPDATE_SUCCESS
    });

    this.error = null;

    this.exportAsync(NeighborhoodSource);
  }

  handleCreateItem(item) {
    debug('handleCreateItem', item);
    this.error = null;
    if (!this.getInstance().isLoading()) {
      setTimeout(() => {
        this.getInstance().createItem(item);
      });
    }
  }
  handleCreateSuccess(neighborhood) {
    debug('handleCreateSuccess', neighborhood);
    this.error = null;
  }

  handleUpdateItem(item) {
    debug('handleUpdateItem', item);
    this.error = null;
    if (!this.getInstance().isLoading()) {
      setTimeout(() => {
        this.getInstance().updateItem(item);
      });
    }
  }
  handleUpdateSuccess(neighborhood) {
    debug('handleUpdateSuccess', neighborhood);
    this.error = null;
  }

  handleRequestFailed(error) {
    debug('handleRequestFailed', error);
    this.error = error;
  }
}

module.exports = NeighborhoodStore;
