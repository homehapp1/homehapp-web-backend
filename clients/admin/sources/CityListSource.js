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
          key: 'cities'
        }
      },
      local: null,
      actions: {
        success: CityListActions.updateItems
      }
    }
  }
});
