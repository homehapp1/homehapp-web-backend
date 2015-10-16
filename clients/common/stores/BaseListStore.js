'use strict';

import alt from '../alt';
import _debugger from '../debugger';
import {merge, enumerate} from '../Helpers';

//let

export default {
  generate: function generate(storeName, structure = {}) {
    let debug = _debugger(storeName);

    if (!structure.actions) {
      throw new Error(`no actions defined for ListStore ${storeName}`);
    }
    if (!structure.source) {
      throw new Error(`no source defined for ListStore ${storeName}`);
    }

    let listeners = {
      handleFetchItems: structure.actions.FETCH_ITEMS,
      handleUpdateItems: structure.actions.UPDATE_ITEMS,
      handleRemoveItem: structure.actions.REMOVE_ITEM,
      handleRemoveSuccess: structure.actions.REMOVE_SUCCESS,
      handleRequestFailed: structure.actions.REQUEST_FAILED
    };

    if (structure.listeners) {
      for (let [name, definition] of enumerate(structure.listeners)) {
        listeners[name] = definition.action;
      }
    }

    let store = class CommonListStore {
      constructor() {
        this.debug = debug;

        this.on('bootstrap', () => {
          debug('bootstrapping');
        });

        if (structure.listeners) {
          for (let [name, definition] of enumerate(structure.listeners)) {
            this[name] = definition.method.bind(this);
          }
        }

        this.bindListeners(listeners);

        this.items = [];
        this.error = null;
        this.removed = false;

        let publicMethods = {
          getItem: this.getItem
        };

        this.exportPublicMethods(publicMethods);

        this.exportAsync(structure.source);
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

      handleFetchItems() {
        debug('handleFetchItems');
        this.items = [];
        this.error = null;
        this.removed = false;
      }
      handleUpdateItems(items) {
        debug('handleUpdateItems', items);
        this.items = items;
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
    };

    return alt.createStore(store, storeName);
  }
};
