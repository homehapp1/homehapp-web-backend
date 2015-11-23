import request from '../../common/request';
import UserActions from '../actions/UserActions';

// let debug = require('../../common/debugger')('UserSource');

let UserSource = {
  createItem: function () {
    return {
      remote(storeState, data) {
        let postData = {
          user: data
        };
        let disallowed = ['uuid', 'id', '_id'];
        for (let key of disallowed) {
          if (typeof data[key] !== 'undefined') {
            delete data[key];
          }
        }
        return request.post(`/api/users`, postData)
          .then((response) => {
            if (!response.data || response.data.status !== 'ok') {
              let err = new Error(response.data.error || 'Invalid response');
              return Promise.reject(err);
            }
            return Promise.resolve(response.data.user);
          })
          .catch((response) => {
            if (response instanceof Error) {
              return Promise.reject(response);
            } else {
              let msg = 'unexpected error';
              if (response.data && response.data.error) {
                msg = response.data.error;
              }
              return Promise.reject(new Error(msg));
            }
            return Promise.reject(response);
          });
      },
      local(storeState/*, data*/) {
        return null;
      },
      shouldFetch(/*state*/) {
        return true;
      },
      success: UserActions.createSuccess,
      error: UserActions.requestFailed,
      loading: UserActions.createItem
    };
  },
  updateItem: function () {
    return {
      remote(storeState, data) {
        let putData = {
          user: data
        };
        let id = data.uuid || data.id;
        delete data.id;
        delete data.uuid;
        return request.put(`/api/users/${id}`, putData)
          .then((response) => {
            if (!response.data || response.data.status !== 'ok') {
              let err = new Error(response.data.error || 'Invalid response');
              return Promise.reject(err);
            }
            return Promise.resolve(response.data.user);
          })
          .catch((response) => {
            if (response instanceof Error) {
              return Promise.reject(response);
            } else {
              let msg = 'unexpected error';
              if (response.data && response.data.error) {
                msg = response.data.error;
              }
              return Promise.reject(new Error(msg));
            }
            return Promise.reject(response);
          });
      },
      local(storeState/*, data*/) {
        return null;
      },
      shouldFetch(/*state*/) {
        return true;
      },
      success: UserActions.updateSuccess,
      error: UserActions.requestFailed,
      loading: UserActions.updateItem
    };
  },
  deleteItem: function() {
    return {
      remote(storeState, data) {
        let id = data.id;
        return request.delete(`/api/users/${id}`)
        .then((response) => {
          if (!response.data || response.data.status !== 'deleted') {
            let err = new Error(response.data.error || 'Invalid response');
            return Promise.reject(err);
          }
          return Promise.resolve(null);
        })
        .catch((response) => {
          if (response instanceof Error) {
            return Promise.reject(response);
          } else {
            let msg = 'unexpected error';
            if (response.data && response.data.error) {
              msg = response.data.error;
            }
            return Promise.reject(new Error(msg));
          }
          return Promise.reject(response);
        });
      },
      local(/*storeState, data*/) {
        return null;
      },
      shouldFetch() {
        return true;
      },
      success: UserActions.deleteSuccess,
      error: UserActions.requestFailed,
      loading: UserActions.deleteItem
    };
  }
};

export default UserSource;
