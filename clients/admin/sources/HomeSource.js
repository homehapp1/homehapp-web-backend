'use strict';

import request from '../../common/request';
import HomeActions from '../actions/HomeActions';

let debug = require('../../common/debugger')('HomeSource');

let HomeSource = {
  createItem: function () {
    debug('createItem', arguments);
    return {
      remote(storeState, data) {
        debug('createItem:remote', arguments, data);
        let postData = {
          home: data
        };
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
    debug('updateItem', arguments);
    return {
      remote(storeState, data) {
        debug('updateItem:remote', arguments, data);
        let putData = {
          home: data
        };
        let id = data.uuid;
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
  }
};

export default HomeSource;
