'use strict';

import alt from '../../common/alt';

let debug = require('../../common/debugger')('AgentListActions');

@alt.createActions
class AgentListActions {
  updateAgents(agents) {
    this.dispatch(agents);
  }
  fetchAgents(skipCache) {
    debug('fetchAgents', skipCache);
    this.dispatch(skipCache);
  }
  fetchFailed(error) {
    debug('fetchFailed', error);
    this.dispatch(error);
  }
}

module.exports = AgentListActions;
