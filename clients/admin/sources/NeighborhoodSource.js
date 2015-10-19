

import request from '../../common/request';
import NeighborhoodActions from '../actions/NeighborhoodActions';

let debug = require('../../common/debugger')('NeighborhoodSource');

let NeighborhoodSource = {
  createItem: function () {
    return {
      remote(storeState, data) {
        debug('createItem:remote', arguments, data);
        let postData = {
          neighborhood: data
        };
        return request.post(`/api/neighborhoods`, postData)
          .then((response) => {
            debug('got response', response);
            if (!response.data || response.data.status !== 'ok') {
              let err = new Error(response.data.error || 'Invalid response');
              return Promise.reject(err);
            }
            return Promise.resolve(response.data.neighborhood);
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
      success: NeighborhoodActions.createSuccess,
      error: NeighborhoodActions.requestFailed,
      loading: NeighborhoodActions.createItem
    };
  },
  updateItem: function () {
    return {
      remote(storeState, data) {
        debug('updateItem:remote', arguments, data);
        let putData = {
          neighborhood: data
        };
        let id = data.uuid;
        delete data.uuid;
        return request.put(`/api/neighborhoods/${id}`, putData)
          .then((response) => {
            debug('got response', response);
            if (!response.data || response.data.status !== 'ok') {
              let err = new Error(response.data.error || 'Invalid response');
              return Promise.reject(err);
            }
            return Promise.resolve(response.data.neighborhood);
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
      success: NeighborhoodActions.updateSuccess,
      error: NeighborhoodActions.requestFailed,
      loading: NeighborhoodActions.updateItem
    };
  }
};

export default NeighborhoodSource;
