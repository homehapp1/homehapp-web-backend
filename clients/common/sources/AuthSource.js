import request from '../request';
import AuthActions from '../actions/AuthActions';

let debug = require('../debugger')('AuthSource');

let AuthSource = {
  fetchUser: () => {
    return {
      remote(/*storeState*/) {
        debug('fetchUser:remote', arguments);
        return request.get(`/api/auth/user`)
          .then((response) => {
            //debug('got response', response);
            if (!response.data || !response.data.user) {
              let err = new Error('Invalid response');
              return Promise.reject(err);
            }
            return Promise.resolve(response.data.user);
          })
          .catch((response) => {
            if (response instanceof Error) {
              return Promise.reject(response);
            }

            if (response.status && response.status === 403) {
              return Promise.resolve(null);
            }

            let msg = 'unexpected error';
            if (response.data.error) {
              msg = response.data.error;
            }

            let error = new Error(msg);
            return Promise.reject(error);
          });
      },
      local(/*storeState*/) {
        return null;
      },
      success: AuthActions.updateUser,
      error: AuthActions.fetchFailed,
      loading: AuthActions.fetchUser
    };
  }
};

export default AuthSource;
