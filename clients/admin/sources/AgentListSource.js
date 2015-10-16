'use strict';

import SourceBuilder from '../../common/sources/Builder';
import AgentListActions from '../actions/AgentListActions';

export default SourceBuilder.build({
  name: 'AgentListSource',
  actions: {
    base: AgentListActions,
    error: AgentListActions.requestFailed
  },
  methods: {
    fetchItems: {
      remote: {
        method: 'get',
        uri: '/api/agents',
        params: null,
        response: {
          key: 'items'
        }
      },
      local: null,
      actions: {
        success: AgentListActions.updateItems
      }
    },
    removeItem: {
      remote: {
        method: 'delete',
        uri: (state, args) => {
          return `/api/agents/${args[0]}`;
        },
        params: null,
        response: (state, response, args) => {
          return Promise.resolve(args[0]);
        }
      },
      local: null,
      actions: {
        success: AgentListActions.removeSuccess
      }
    }
  }
});
