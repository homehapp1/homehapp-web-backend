import SourceBuilder from '../../common/sources/Builder';
import PageListActions from '../actions/PageListActions';

export default SourceBuilder.build({
  name: 'PageListSource',
  actions: {
    base: PageListActions,
    error: PageListActions.requestFailed
  },
  methods: {
    fetchItems: {
      remote: {
        method: 'get',
        uri: '/api/pages',
        params: null,
        response: {
          key: 'pages'
        }
      },
      local: null,
      actions: {
        success: PageListActions.updateItems
      }
    },
    updateItem: {
      remote: {
        method: 'put',
        uri: (state, args) => {
          return `/api/pages/${args[0].uuid}`;
        },
        params: (state, args) => {
          return {
            content: args[0]
          };
        },
        response: {
          key: 'pages'
        }
      },
      local: null,
      actions: {
        success: PageListActions.updateItems
      }
    },
    removeItem: {
      remote: {
        method: 'delete',
        uri: (state, args) => {
          return `/api/pages/${args[0]}`;
        },
        params: null,
        response: (state, response, args) => {
          return Promise.resolve(args[0]);
        }
      },
      local: null,
      actions: {
        success: PageListActions.removeSuccess
      }
    }
  }
});
