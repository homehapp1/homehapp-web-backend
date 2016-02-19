import alt from '../../common/alt';

let debug = require('../../common/debugger')('ContactActions');

@alt.createActions
class ContactActions {
  createItem(item) {
    debug('createItem', item);
    this.dispatch(item);
  }
  createSuccess(count) {
    this.dispatch(count);
  }
  fetchItem(id) {
    debug('fetchItem', id);
    this.dispatch(id);
  }
  requestFailed(error) {
    debug('requestFailed', error);
    this.dispatch(error);
  }
}

module.exports = ContactActions;
