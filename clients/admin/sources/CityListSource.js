import SourceBuilder from '../../common/sources/Builder';
import CityListActions from '../actions/CityListActions';
// let debug = require('debug')('CityListSource');

export default SourceBuilder.build({
  name: 'CityListSource',
  actions: {
    base: CityListActions,
    error: CityListActions.requestFailed
  },
  methods: {
    fetchItems: {
      remote: {
        method: 'get',
        uri: '/api/cities',
        params: null,
        response: {
          key: 'items'
        }
      },
      local: null,
      actions: {
        success: CityListActions.updateItems
      }
    },
    updateItem: {
      remote: {
        method: 'put',
        uri: (state, args) => {
          return `/api/cities/${args[0].uuid}`;
        },
        params: (state, args) => {
          return {
            city: args[0]
          };
        },
        response: {
          key: 'items'
        }
      },
      local: null,
      actions: {
        success: CityListActions.updateItems
      }
    },
    removeItem: {
      remote: {
        method: 'delete',
        uri: (state, args) => {
          return `/api/cities/${args[0]}`;
        },
        params: null,
        response: (state, response, args) => {
          return Promise.resolve(args[0]);
        }
      },
      local: null,
      actions: {
        success: CityListActions.removeSuccess
      }
    }
  }
});
