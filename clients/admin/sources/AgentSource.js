'use strict';

import request from '../../common/request';
import AgentActions from '../actions/AgentActions';

let debug = require('../../common/debugger')('AgentSource');

let AgentSource = {
  createItem: function () {
    return {
      remote(storeState, data) {
        debug('createItem:remote', arguments, data);
        let postData = {
          agent: data
        };
        let disallowed = ['uuid', 'id', '_id'];
        for (let key of disallowed) {
          if (typeof data[key] !== 'undefined') {
            delete data[key];
          }
        }
        debug('Sanitized model', data);
        return request.post(`/api/agents`, postData)
          .then((response) => {
            debug('Got response', response);
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
    return {
      remote(storeState, data) {
        debug('updateItem:remote', arguments, data);
        let putData = {
          agent: data
        };
        let id = data.uuid || data.id;
        delete data.uuid;
        return request.put(`/api/agents/${id}`, putData)
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
  },
  deleteItem: function() {
    debug('deleteItem', arguments);
    return {
      remote(storeState, data) {
        debug('deleteItem:remote', arguments, data);
        let id = data.id;
        return request.delete(`/api/agents/${id}`)
        .then((response) => {
          debug('Got response when deleting', response);
          if (!response.data || response.data.status !== 'deleted') {
            let err = new Error(response.data.error || 'Invalid response');
            return Promise.reject(err);
          }
          return Promise.resolve(null);
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
        debug('deleteItem:local', arguments, data);
      },
      shouldFetch() {
        debug('deleteItem should always fetch from the server side');
        return true;
      },
      success: AgentActions.deleteSuccess,
      error: AgentActions.requestFailed,
      loading: AgentActions.deleteItem
    };
  },
  releaseNumber: function () {
    return {
      remote(storeState, id) {
        debug('releaseNumber:remote', arguments, id);
        return request.delete(`/api/agents/${id}/contactnumber`)
          .then((response) => {
            debug('releaseNumber:response', response);
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
        return null;
      },
      success: AgentActions.updateSuccess,
      error: AgentActions.requestFailed,
      loading: AgentActions.releaseNumber
    };
  }
};

export default AgentSource;
