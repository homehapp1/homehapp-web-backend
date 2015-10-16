'use strict';

import request from '../../common/request';
import AgentListActions from '../actions/AgentListActions';

let debug = require('../../common/debugger')('AgentListSource');

let AgentListSource = {
  fetchItems: () => {
    return {
      remote(_, query = {}) {
        // debug('fetchItems:remote', query);
        return request.get(`/api/agents`, {
          params: query
        })
        .then((response) => {
          debug('Got response', response);
          if (!response.data || !response.data.items) {
            let err = new Error('Invalid response');
            return Promise.reject(err);
          }
          return Promise.resolve(response.data.items);
        })
        .catch((response) => {
          if (response instanceof Error) {
            return Promise.reject(response);
          } else {
            let msg = 'unexpected error';
            if (response.data.error) {
              msg = response.data.error;
            }
            return Promise.reject(new Error(msg));
          }
          return Promise.reject(response);
        });
      },
      local() {
        return null;
      },
      success: AgentListActions.updateItems,
      error: AgentListActions.requestFailed,
      loading: AgentListActions.fetchItems
    };
  },
  removeItem: function () {
    return {
      remote(storeState, id) {
        //debug('remove:remote', arguments, id);
        return request.delete(`/api/agents/${id}`)
          .then((response) => {
            debug('got response', response);
            if (!response.data || response.data.status !== 'ok') {
              let err = new Error(response.data.error || 'Invalid response');
              return Promise.reject(err);
            }
            return Promise.resolve(id);
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
      local() {
        return null;
      },
      success: AgentListActions.removeSuccess,
      error: AgentListActions.requestFailed,
      loading: AgentListActions.removeItem
    };
  }
};

export default AgentListSource;
