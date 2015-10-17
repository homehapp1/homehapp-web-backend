

import alt from '../alt';
import _debugger from '../debugger';
import {merge} from '../Helpers';

export default {
  generate: function generate(name, definitions = {}) {
    let debug = _debugger(name);
    let actions = merge({
      updateItems(items) {
        debug('updateItems', items);
        this.dispatch(items);
      },
      fetchItems(query) {
        debug('fetchItems', query);
        this.dispatch(query);
      },
      removeItem(id) {
        debug('removeItem', id);
        this.dispatch(id);
      },
      removeSuccess(id) {
        debug('removeSuccess', id);
        this.dispatch(id);
      },
      requestFailed(error) {
        debug('requestFailed', error);
        this.dispatch(error);
      }
    }, definitions);

    return alt.createActions(actions);
  }
};
