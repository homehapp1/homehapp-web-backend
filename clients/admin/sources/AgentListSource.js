'use strict';

import request from '../../common/request';
import AgentListActions from '../actions/AgentListActions';

let debug = require('../../common/debugger')('AgentListSource');

let AgentListSource = {
  fetchAgents: () => {
    return {
      remote(/*storeState*/) {
        // debug('fetchAgents:remote', arguments);
        return request.get(`/api/agents`)
          .then((response) => {
            debug('Got response', response);
            if (!response.data || !response.data.agents) {
              let err = new Error('Invalid response');
              return Promise.reject(err);
            }
            return Promise.resolve(response.data.agents);
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
      local(/*storeState, slug*/) {
        // debug('fetchAgents:local', arguments);
        return null;
      },
      success: AgentListActions.updateAgents,
      error: AgentListActions.fetchFailed,
      loading: AgentListActions.fetchAgents
    };
  }
};

export default AgentListSource;
