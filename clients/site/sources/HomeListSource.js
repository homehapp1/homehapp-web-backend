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

          // Pass the allowed keys with quick validation
          if (typeof args[0] === 'object') {
            for (let i in args[0]) {
              let v = args[0][i];
              switch (i) {
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
                case 'story':
                  filters.push('story=1');
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
