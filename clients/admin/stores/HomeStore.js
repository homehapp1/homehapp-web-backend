'use strict';

import alt from '../../common/alt';
import HomeActions from '../actions/HomeActions';
import HomeSource from '../sources/HomeSource';
// import Cache from '../../common/Cache';

let debug = require('../../common/debugger')('HomeStore');

@alt.createStore
class HomeStore {
  constructor() {
    this.on('bootstrap', () => {
      debug('bootstrapping', this.home);
    });

    this.bindListeners({
      handleCreateItem: HomeActions.CREATE_ITEM,
      handleUpdateItem: HomeActions.UPDATE_ITEM,
      handleRequestFailed: HomeActions.REQUEST_FAILED,
      handleCreateSuccess: HomeActions.CREATE_SUCCESS,
      handleUpdateSuccess: HomeActions.UPDATE_SUCCESS
    });

    this.error = null;

    this.exportAsync(HomeSource);
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
  handleCreateSuccess(home) {
    debug('handleCreateSuccess', home);
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
  handleUpdateSuccess(home) {
    debug('handleUpdateSuccess', home);
    this.error = null;
  }

  handleRequestFailed(error) {
    debug('handleRequestFailed', error);
    this.error = error;
  }
}

module.exports = HomeStore;
