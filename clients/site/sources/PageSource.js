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
    getItem: {
      remote: {
        method: 'get',
        uri: (state, args) => {
          return `/api/pages/${args[0]}`;
        },
        params: (state, args) => {
          return {
            page: args[0]
          };
        },
        response: {
          key: 'page'
        }
      },
      local: null,
      actions: {
        success: PageActions.updateSuccess
      }
    }
  }
});
