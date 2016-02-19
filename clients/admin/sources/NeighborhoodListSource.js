import SourceBuilder from '../../common/sources/Builder';
import NeighborhoodListActions from '../actions/NeighborhoodListActions';
// let debug = require('debug')('NeighborhoodListSource');

export default SourceBuilder.build({
  name: 'NeighborhoodListSource',
  actions: {
    base: NeighborhoodListActions,
    error: NeighborhoodListActions.requestFailed
  },
  methods: {
    fetchItems: {
      remote: {
        method: 'get',
        uri: '/api/neighborhoods',
        params: null,
        response: {
          key: 'items'
        }
      },
      local: null,
      actions: {
        success: NeighborhoodListActions.updateItems
      }
    },
    fetchAllItems: {
      remote: {
        method: 'get',
        uri: '/api/neighborhoods/all',
        params: null,
        response: {
          key: 'items'
        }
      },
      local: null,
      actions: {
        success: NeighborhoodListActions.updateItems
      }
    },
    fetchPopulatedItems: {
      remote: {
        method: 'get',
        uri: '/api/neighborhoods/populated',
        params: null,
        response: {
          key: 'items'
        }
      },
      local: null,
      actions: {
        success: NeighborhoodListActions.updateItems
      }
    },
    updateItem: {
      remote: {
        method: 'put',
        uri: (state, args) => {
          return `/api/neighborhoods/${args[0].uuid}`;
        },
        params: (state, args) => {
          return {
            neighborhood: args[0]
          };
        },
        response: {
          key: 'items'
        }
      },
      local: null,
      actions: {
        success: NeighborhoodListActions.updateItems
      }
    },
    removeItem: {
      remote: {
        method: 'delete',
        uri: (state, args) => {
          return `/api/neighborhoods/${args[0]}`;
        },
        params: null,
        response: (state, response, args) => {
          return Promise.resolve(args[0]);
        }
      },
      local: null,
      actions: {
        success: NeighborhoodListActions.removeSuccess
      }
    }
  }
});
