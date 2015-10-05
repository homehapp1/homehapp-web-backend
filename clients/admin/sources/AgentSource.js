'use strict';

import request from '../../common/request';
import AgentActions from '../actions/AgentActions';

let debug = require('../../common/debugger')('AgentSource');

let AgentSource = {
  createItem: function () {
    debug('createItem', arguments);
    return {
      remote(storeState, data) {
        debug('createItem:remote', arguments, data);
        let postData = {
          agent: data
        };
        return request.post(`/api/agents`, postData)
          .then((response) => {
            debug('got response', response);
            if (!response.data || response.data.status !== 'ok') {
              let err = new Error(response.data.error || 'Invalid response');
              return Promise.reject(err);
            }
            return Promise.resolve(response.data.agent);
          })
          .catch((response) => {
            if (response instanceof Error) {
              return Promise.reject(response);
            } else {
              let msg = 'unexpected error';
              if (response.data && response.data.error) {
                msg = response.data.error;
              }
              return Promise.reject(new Error(msg));
            }
            return Promise.reject(response);
          });
      },
      local(storeState, data) {
        debug('createItem:local', arguments, data);
        return null;
      },
      shouldFetch(state) {
        debug('createItem:shouldFetch', arguments, state);
        return true;
      },
      success: AgentActions.createSuccess,
      error: AgentActions.requestFailed,
      loading: AgentActions.createItem
    };
  },
  updateItem: function () {
    debug('updateItem', arguments);
    return {
      remote(storeState, data) {
        debug('updateItem:remote', arguments, data);
        let putData = {
          agent: data
        };
        let id = data.uuid;
        delete data.uuid;
        return request.patch(`/api/agents/${id}`, putData)
          .then((response) => {
            debug('got response', response);
            if (!response.data || response.data.status !== 'ok') {
              let err = new Error(response.data.error || 'Invalid response');
              return Promise.reject(err);
            }
            return Promise.resolve(response.data.agent);
          })
          .catch((response) => {
            if (response instanceof Error) {
              return Promise.reject(response);
            } else {
              let msg = 'unexpected error';
              if (response.data && response.data.error) {
                msg = response.data.error;
              }
              return Promise.reject(new Error(msg));
            }
            return Promise.reject(response);
          });
      },
      local(storeState, data) {
        debug('createItem:local', arguments, data);
        return null;
      },
      shouldFetch(state) {
        debug('createItem:shouldFetch', arguments, state);
        return true;
      },
      success: AgentActions.updateSuccess,
      error: AgentActions.requestFailed,
      loading: AgentActions.updateItem
    };
  }
};

export default AgentSource;
