import SourceBuilder from '../../common/sources/Builder';
import NeighborhoodActions from '../actions/NeighborhoodActions';
// let debug = require('debug')('NeighborhoodSource');

export default SourceBuilder.build({
  name: 'NeighborhoodSource',
  actions: {
    base: NeighborhoodActions,
    error: NeighborhoodActions.requestFailed
  },
  methods: {
    updateItem: {
      remote: {
        method: 'put',
        uri: (state, args) => {
          let id = args[0].uuid || args[0].id;
          return `/api/neighborhoods/${id}`;
        },
        params: (state, args) => {
          return {
            neighborhood: args[0]
          };
        },
        response: {
          key: 'item'
        }
      },
      local: null,
      actions: {
        success: NeighborhoodActions.updateSuccess
      }
    }
  }
});
