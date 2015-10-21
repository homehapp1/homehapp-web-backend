import SourceBuilder from '../../common/sources/Builder';
import PageActions from '../actions/PageActions';
let debug = require('debug')('PageSource');

export default SourceBuilder.build({
  name: 'PageSource',
  actions: {
    base: PageActions,
    error: PageActions.requestFailed
  },
  methods: {
    updateItem: {
      remote: {
        method: 'put',
        uri: (state, args) => {
          let id = args[0].uuid || args[0].id;
          return `/api/page/${id}`;
        },
        params: (state, args) => {
          return {
            page: args[0]
          };
        },
        response: {
          key: 'item'
        }
      },
      local: null,
      actions: {
        success: PageActions.updateSuccess
      }
    }
  }
});
