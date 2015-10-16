'use strict';

import alt from '../../common/alt';
import AgentActions from '../actions/AgentActions';
import AgentSource from '../sources/AgentSource';

let debug = require('../../common/debugger')('AgentStore');

@alt.createStore
class AgentStore {
  constructor() {
    this.bindListeners({
      handleCreateItem: AgentActions.CREATE_ITEM,
      handleCreateSuccess: AgentActions.CREATE_SUCCESS,
      handleUpdateItem: AgentActions.UPDATE_ITEM,
      handleUpdateSuccess: AgentActions.UPDATE_SUCCESS,
      handleReleaseNumber: AgentActions.RELEASE_NUMBER,
      handleRequestFailed: AgentActions.REQUEST_FAILED
    });

    this.error = null;
    this.agent = null;
    this.exportAsync(AgentSource);
  }

  handleCreateItem(item) {
    debug('handleCreateItem', item);
    this.error = null;
    this.agent = null;
    if (!this.getInstance().isLoading()) {
      setTimeout(() => {
        this.getInstance().createItem(item);
      });
    }
  }
  handleCreateSuccess(agent) {
    debug('handleCreateSuccess', agent);
    this.error = null;
    this.agent = agent;
  }

  handleUpdateItem(item) {
    debug('handleUpdateItem', item);
    this.error = null;
    if (!this.getInstance().isLoading()) {
      setTimeout(() => {
        this.getInstance().updateItem(item);
      });
    }
  }
  handleUpdateSuccess(agent) {
    debug('handleUpdateSuccess', agent);
    this.error = null;
    this.agent = agent;
  }

  handleReleaseNumber(id) {
    this.error = null;
    if (!this.getInstance().isLoading()) {
      setTimeout(() => {
        debug('instance', this.getInstance());
        this.getInstance().releaseNumber(id);
      });
    }
  }

  handleRequestFailed(error) {
    debug('handleRequestFailed', error);
    this.error = error;
  }
}

module.exports = AgentStore;
