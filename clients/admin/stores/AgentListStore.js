'use strict';

import alt from '../../common/alt';
import AgentListActions from '../actions/AgentListActions';
import AgentListSource from '../sources/AgentListSource';

let debug = require('../../common/debugger')('AgentListStore');

@alt.createStore
class AgentListStore {
  constructor() {
    this.bindListeners({
      handleUpdateItems: AgentListActions.UPDATE_ITEMS,
      handleFetchItems: AgentListActions.FETCH_ITEMS,
      handleRemoveItem: AgentListActions.REMOVE_ITEM,
      handleRemoveSuccess: AgentListActions.REMOVE_SUCCESS,
      handleRequestFailed: AgentListActions.REQUEST_FAILED
    });

    this.items = [];
    this.error = null;
    this.removed = false;

    this.exportPublicMethods({
      getItem: this.getItem
    });

    this.exportAsync(AgentListSource);
  }

  getItem(id) {
    debug('getItem', id);
    let { items } = this.getState();
    for (let item of items) {
      if (item.id === id) {
        return item;
      }
    }
    return null;
  }

  handleUpdateItems(items) {
    debug('handleUpdateItems', items);
    this.items = items;
    this.error = null;
    this.removed = false;
  }
  handleFetchItems() {
    debug('handleFetchItems');
    this.items = [];
    this.error = null;
    this.removed = false;
  }
  handleRemoveItem(id) {
    debug('handleRemoveItem', id);
    this.error = null;
    if (!this.getInstance().isLoading()) {
      setTimeout(() => {
        this.getInstance().removeItem(id);
      });
    }
  }
  handleRemoveSuccess(id) {
    debug('handleRemoveSuccess', id);
    this.removed = true;
    this.error = null;
    this.emitChange();
  }
  handleRequestFailed(error) {
    debug('handleRequestFailed', error);
    this.error = error;
    this.removed = false;
  }
}

module.exports = AgentListStore;
