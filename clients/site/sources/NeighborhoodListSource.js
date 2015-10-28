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
    }
  }
});
