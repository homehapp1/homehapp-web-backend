'use strict';

import request from '../../common/request';
import NeighborhoodListActions from '../actions/NeighborhoodListActions';

let debug = require('../../common/debugger')('NeighborhoodListSource');

let NeighborhoodListSource = {
  fetchNeighborhoods: () => {
    return {
      remote(/*storeState*/) {
        debug('fetchNeighborhoods:remote', arguments);
        return request.get(`/api/neighborhoods`)
          .then((response) => {
            debug('got response', response);
            if (!response.data || !response.data.neighborhoods) {
              let err = new Error('Invalid response');
              return Promise.reject(err);
            }
            return Promise.resolve(response.data.neighborhoods);
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
      success: NeighborhoodListActions.updateNeighborhoods,
      error: NeighborhoodListActions.fetchFailed,
      loading: NeighborhoodListActions.fetchNeighborhoods
    };
  }
};

export default NeighborhoodListSource;
