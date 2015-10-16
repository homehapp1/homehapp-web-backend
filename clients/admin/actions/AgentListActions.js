'use strict';

import alt from '../../common/alt';

let debug = require('../../common/debugger')('AgentListActions');

@alt.createActions
class AgentListActions {
  updateItems(items) {
    this.dispatch(items);
  }
  fetchItems(query) {
    debug('fetchItems', query);
    this.dispatch(query);
  }
  removeItem(id) {
    debug('removeItem', id);
    this.dispatch(id);
  }
  removeSuccess(id) {
    this.dispatch(id);
  }
  requestFailed(error) {
    debug('requestFailed', error);
    this.dispatch(error);
  }
}

module.exports = AgentListActions;
