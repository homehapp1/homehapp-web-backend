'use strict';

import alt from '../../common/alt';

let debug = require('../../common/debugger')('UserActions');

@alt.createActions
class UserActions {
  createItem(item) {
    debug('createItem', item);
    this.dispatch(item);
  }
  createSuccess(count) {
    this.dispatch(count);
  }
  updateItem(item) {
    debug('updateItem', item);
    this.dispatch(item);
  }
  updateSuccess(count) {
    this.dispatch(count);
  }
  deleteItem(item) {
    debug('deleteItem', item);
    this.dispatch(item);
  }
  deleteSuccess(count) {
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

module.exports = UserActions;
