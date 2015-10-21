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
    createItem: {
      remote: {
        method: 'post',
        uri: '/api/pages',
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
    },
    updateItem: {
      remote: {
        method: 'put',
        uri: (state, args) => {
          let id = args[0].uuid || args[0].id;
          return `/api/pages/${id}`;
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
