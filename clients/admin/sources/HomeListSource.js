'use strict';

import request from '../../common/request';
import HomeListActions from '../actions/HomeListActions';

let debug = require('../../common/debugger')('HomeListSource');

let HomeListSource = {
  fetchHomes: () => {
    return {
      remote(storeState) {
        debug('fetchHomes:remote', arguments);
        return request.get(`/api/homes`)
          .then((response) => {
            debug('got response', response);
            if (!response.data || !response.data.homes) {
              let err = new Error('Invalid response');
              return Promise.reject(err);
            }
            return Promise.resolve(response.data.homes);
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
      local(storeState, slug) {
        return null;
      },
      success: HomeListActions.updateHomes,
      error: HomeListActions.fetchFailed,
      loading: HomeListActions.fetchHomes
    };
  }
};

export default HomeListSource;
