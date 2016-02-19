import request from '../../common/request';
import HomeActions from '../actions/HomeActions';

let debug = require('../../common/debugger')('HomeSource');

let HomeSource = {
  createItem: function () {
    return {
      remote(storeState, data) {
        debug('createItem:remote', arguments, data);
        let postData = {
          home: data
        };
        let disallowed = ['uuid', 'id', '_id'];
        for (let key of disallowed) {
          if (typeof data[key] !== 'undefined') {
            delete data[key];
          }
        }
        return request.post(`/api/homes`, postData)
          .then((response) => {
            debug('got response', response);
            if (!response.data || response.data.status !== 'ok') {
              let err = new Error(response.data.error || 'Invalid response');
              return Promise.reject(err);
            }
            return Promise.resolve(response.data.home);
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
      local(storeState, data) {
        debug('createItem:local', arguments, data);
        return null;
      },
      shouldFetch(state) {
        debug('createItem:shouldFetch', arguments, state);
        return true;
      },
      success: HomeActions.createSuccess,
      error: HomeActions.requestFailed,
      loading: HomeActions.createItem
    };
  },
  updateItem: function () {
    return {
      remote(storeState, data) {
        debug('updateItem:remote', arguments, data);
        let putData = {
          home: data
        };
        let id = data.uuid || data.id;
        delete data.id;
        delete data.uuid;
        return request.put(`/api/homes/${id}`, putData)
          .then((response) => {
            debug('got response', response);
            if (!response.data || response.data.status !== 'ok') {
              let err = new Error(response.data.error || 'Invalid response');
              return Promise.reject(err);
            }
            return Promise.resolve(response.data.home);
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
      local(storeState, data) {
        debug('createItem:local', arguments, data);
        return null;
      },
      shouldFetch(state) {
        debug('createItem:shouldFetch', arguments, state);
        return true;
      },
      success: HomeActions.updateSuccess,
      error: HomeActions.requestFailed,
      loading: HomeActions.updateItem
    };
  },
  deleteItem: function() {
    debug('deleteItem', arguments);
    return {
      remote(storeState, data) {
        debug('deleteItem:remote', arguments, data);
        let id = data.id;
        return request.delete(`/api/homes/${id}`)
        .then((response) => {
          debug('Got response when deleting', response);
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
      local(storeState, data) {
        debug('deleteItem:local', arguments, data);
      },
      shouldFetch() {
        debug('deleteItem should always fetch from the server side');
        return true;
      },
      success: HomeActions.deleteSuccess,
      error: HomeActions.requestFailed,
      loading: HomeActions.deleteItem
    };
  }
};

export default HomeSource;
