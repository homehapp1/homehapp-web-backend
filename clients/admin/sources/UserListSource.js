import request from '../../common/request';
import UserListActions from '../actions/UserListActions';

let debug = require('../../common/debugger')('UserListSource');

let UserListSource = {
  fetchUsers: () => {
    return {
      remote(/*storeState*/) {
        debug('fetchUsers:remote', arguments);
        return request.get(`/api/users`)
          .then((response) => {
            debug('got response', response);
            if (!response.data || !response.data.users) {
              let err = new Error('Invalid response');
              return Promise.reject(err);
            }
            return Promise.resolve(response.data.users);
          })
          .catch((response) => {
            if (response instanceof Error) {
              return Promise.reject(response);
            } else {
              let msg = 'unexpected error';
              if (response.data.error) {
                msg = response.data.error;
              }
              return Promise.reject(new Error(msg));
            }
            return Promise.reject(response);
          });
      },
      local(/*storeState, slug*/) {
        return null;
      },
      success: UserListActions.updateUsers,
      error: UserListActions.fetchFailed,
      loading: UserListActions.fetchUsers
    };
  }
};

export default UserListSource;
