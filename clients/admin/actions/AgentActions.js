'use strict';

import alt from '../../common/alt';

let debug = require('../../common/debugger')('AgentActions');

@alt.createActions
class AgentActions {
  createItem(data) {
    debug('createItem', data);
    this.dispatch(data);
  }
  createSuccess(model) {
    this.dispatch(model);
  }
  updateItem(data) {
    debug('updateItem', data);
    this.dispatch(data);
  }
  updateSuccess(model) {
    this.dispatch(model);
  }
  releaseNumber(id) {
    debug('releaseNumber', id);
    this.dispatch(id);
  }
  requestFailed(error) {
    debug('requestFailed', error);
    this.dispatch(error);
  }
}

module.exports = AgentActions;
