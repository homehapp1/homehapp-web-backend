'use strict';

import alt from '../../common/alt';
import AgentActions from '../actions/AgentActions';
import AgentSource from '../sources/AgentSource';
// import Cache from '../../common/Cache';

let debug = require('../../common/debugger')('AgentStore');

@alt.createStore
class AgentStore {
  constructor() {
    this.on('bootstrap', () => {
      debug('bootstrapping', this.agent);
    });

    this.bindListeners({
      handleCreateItem: AgentActions.CREATE_ITEM,
      handleUpdateItem: AgentActions.UPDATE_ITEM,
      handleDeleteItem: AgentActions.DELETE_ITEM,
      handleReleaseNumber: AgentActions.RELEASE_NUMBER,
      handleCreateSuccess: AgentActions.CREATE_SUCCESS,
      handleUpdateSuccess: AgentActions.UPDATE_SUCCESS,
      handleDeleteSuccess: AgentActions.DELETE_SUCCESS,
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
  handleDeleteItem(item) {
    debug('handleDeleteItem', item);
    this.error = null;
    if (!this.getInstance().isLoading()) {
      setTimeout(() => {
        debug('instance', this.getInstance());
        this.getInstance().deleteItem(item);
      });
    }
  }
  handleDeleteSuccess(agent) {
    debug('handleDeleteSuccess', agent);
    this.error = null;
    this.agent = null;
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
