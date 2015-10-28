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
        uri: (model, args) => {
          let url = '/api/neighborhoods';
          let filters = [];

          // Pass the allowed keys with quick validation
          if (typeof args[0] === 'object') {
            for (let i in args[0]) {
              let v = args[0][i];
              switch (i) {
                case 'city':
                  url += `/${v}`;
                  break;
                case 'limit':
                  if (!isNaN(v)) {
                    filters.push(`limit=${v}`);
                  }
                  break;
                case 'type':
                  if (['', 'buy', 'rent'].indexOf(v) !== -1) {
                    filters.push(`type=${v}`);
                  }
                  break;
              }
            }
          }
          if (filters.length) {
            url += `?${filters.join('&')}`;
          }
          return url;
        },
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
