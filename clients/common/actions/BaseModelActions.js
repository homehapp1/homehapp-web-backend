import alt from '../alt';
import _debugger from '../debugger';
import {merge} from '../Helpers';

export default {
  generate: function generate(name, definitions = {}) {
    let debug = _debugger(name);
    let actions = merge({
      createItem(data) {
        debug('createItem', data);
        this.dispatch(data);
      },
      createSuccess(model) {
        debug('createSuccess', model);
        this.dispatch(model);
      },
      updateItem(data) {
        debug('updateItem', data);
        this.dispatch(data);
      },
      updateSuccess(model) {
        debug('updateSuccess', model);
        this.dispatch(model);
      },
      requestFailed(error) {
        debug('requestFailed', error);
        this.dispatch(error);
      }
    }, definitions);

    return alt.createActions(actions);
  }
};
