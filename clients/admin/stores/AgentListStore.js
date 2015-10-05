'use strict';

import alt from '../../common/alt';
import AgentListActions from '../actions/AgentListActions';
import AgentListSource from '../sources/AgentListSource';
// import Cache from '../../common/Cache';

let debug = require('../../common/debugger')('AgentListStore');

@alt.createStore
class AgentListStore {
  constructor() {
    this.on('bootstrap', () => {
      debug('bootstrapping', this.agents);
    });

    this.bindListeners({
      handleUpdateAgents: AgentListActions.UPDATE_AGENTS,
      handleFetchAgents: AgentListActions.FETCH_AGENTS,
      handleFetchFailed: AgentListActions.FETCH_FAILED
    });

    this.agents = [];
    this.error = null;

    this.exportPublicMethods({
      getAgent: this.getAgent
    });

    this.exportAsync(AgentListSource);
  }

  getAgent(id) {
    debug('getAgent', id);
    let { agents } = this.getState();
    debug('Got agents', agents);
    for (let agent of agents) {
      if (!id) {
        return agent;
      }
      if (agent.id === id) {
        return agent;
      }
    }
    debug('No matching id found in agents');
    this.error = 'No matching id found in agents';
  }

  handleUpdateAgents(agents) {
    debug('handleUpdateAgents', agents);
    this.agents = agents;
    this.error = null;
  }
  handleFetchAgents() {
    debug('handleFetchAgents');
    this.agents = [];
    this.error = null;
  }
  handleFetchFailed(error) {
    debug('handleFetchFailed', error);
    this.error = error;
  }
}

module.exports = AgentListStore;
