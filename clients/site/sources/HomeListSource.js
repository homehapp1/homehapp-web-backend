import SourceBuilder from '../../common/sources/Builder';
import HomeListActions from '../actions/HomeListActions';
// let debug = require('debug')('HomeListSource');

export default SourceBuilder.build({
  name: 'HomeListSource',
  actions: {
    base: HomeListActions,
    error: HomeListActions.requestFailed
  },
  methods: {
    fetchItems: {
      remote: {
        method: 'get',
        uri: (model, args) => {
          let url = '/api/homes';
          let filters = [];
          if (typeof args[0] === 'object') {
            if (args[0].type) {
              filters.push(`type=${args[0].type}`);
            }
          }
          if (filters.length) {
            url += `?${filters.join('&')}`;
          }
          return url;
        },
        params: null,
        response: {
          key: 'homes'
        }
      },
      local: null,
      actions: {
        success: HomeListActions.updateItems
      }
    }
  }
});
