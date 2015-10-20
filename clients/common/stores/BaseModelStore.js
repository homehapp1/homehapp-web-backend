import alt from '../alt';
import _debugger from '../debugger';
import {enumerate} from '../Helpers';

export default {
  generate: function generate(storeName, structure = {}) {
    let debug = _debugger(storeName);

    if (!structure.actions) {
      throw new Error(`no actions defined for ModelStore ${storeName}`);
    }
    if (!structure.source) {
      throw new Error(`no source defined for ModelStore ${storeName}`);
    }

    let listeners = {
      handleCreateItem: structure.actions.CREATE_ITEM,
      handleCreateSuccess: structure.actions.CREATE_SUCCESS,
      handleUpdateItem: structure.actions.UPDATE_ITEM,
      handleUpdateSuccess: structure.actions.UPDATE_SUCCESS,
      handleRequestFailed: structure.actions.REQUEST_FAILED
    };

    if (structure.listeners) {
      for (let [name, definition] of enumerate(structure.listeners)) {
        listeners[name] = definition.action;
      }
    }

    let store = class CommonModelStore {
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

        this.model = null;
        this.created = false;
        this.error = null;

        if (structure.publicMethods) {
          let publicMethods = {};
          for (let [name, method] of enumerate(structure.publicMethods)) {
            publicMethods[name] = method.bind(this);
          }
          this.exportPublicMethods(publicMethods);
        }

        this.exportAsync(structure.source);
      }

      handleCreateItem(model) {
        debug('handleCreateItem', model);
        this.error = null;
        this.model = null;
        if (!this.getInstance().isLoading()) {
          setTimeout(() => {
            this.getInstance().createItem(model);
          });
        }
      }
      handleCreateSuccess(model) {
        debug('handleCreateSuccess', model);
        this.error = null;
        this.model = model;
        this.created = true;
      }
      handleUpdateItem(model) {
        debug('handleUpdateItem', model);
        this.error = null;
        this.created = false;
        if (!this.getInstance().isLoading()) {
          setTimeout(() => {
            this.getInstance().updateItem(model);
          });
        }
      }
      handleUpdateSuccess(model) {
        debug('handleUpdateSuccess', model);
        this.error = null;
        this.model = model;
      }
      handleRequestFailed(error) {
        debug('handleRequestFailed', error);
        this.error = error;
        this.created = false;
      }
    };

    return alt.createStore(store, storeName);
  }
};
