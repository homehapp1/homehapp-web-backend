'use strict';

import alt from '../../common/alt';

let debug = require('../../common/debugger')('HomeActions');

@alt.createActions
class HomeActions {
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
  fetchItem(id) {
    debug('fetchItem', id);
    this.dispatch(id);
  }
  requestFailed(error) {
    debug('requestFailed', error);
    this.dispatch(error);
  }
}

module.exports = HomeActions;
