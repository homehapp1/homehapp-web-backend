import SourceBuilder from '../../common/sources/Builder';
import CityActions from '../actions/CityActions';
// let debug = require('debug')('CitySource');

export default SourceBuilder.build({
  name: 'CitySource',
  actions: {
    base: CityActions,
    error: CityActions.requestFailed
  },
  methods: {
    updateItem: {
      remote: {
        method: 'put',
        uri: (state, args) => {
          let id = args[0].uuid || args[0].id;
          return `/api/cities/${id}`;
        },
        params: (state, args) => {
          return {
            city: args[0]
          };
        },
        response: {
          key: 'item'
        }
      },
      local: null,
      actions: {
        success: CityActions.updateSuccess
      }
    }
  }
});
