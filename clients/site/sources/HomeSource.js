'use strict';

import request from '../../common/request';
import HomeActions from '../actions/HomeActions';
import Cache from '../../common/Cache';

let debug = require('../../common/debugger')('HomeSource');

let HomeSource = {
  fetchHomeBySlug: () => {
    return {
      remote(storeState, slug) {
        debug('fetchHomeBySlug:remote', arguments);
        return request.get(`/api/home/${slug}`)
          .then((response) => {
            //debug('got response', response);
            if (!response.data || !response.data.home) {
              let err = new Error('Invalid response');
              return Promise.reject(err);
            }
            Cache.set('homesBySlug', slug, response.data.home);
            return Promise.resolve(response.data.home);
          })
          .catch((response) => {
            if (response instanceof Error) {
              // cient side error
              //console.log('Error', response.message);
              return Promise.reject(response);
            } else {
              // The request was made, but the server responded with a status code
              // that falls out of the range of 2xx
              // console.log(response.data);
              // console.log(response.status);
              // console.log(response.headers);
              // console.log(response.config);
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
        debug('fetchHomeBySlug:local', arguments);
        if (Cache.has('homesBySlug', slug)) {
          return Cache.get('homesBySlug', slug);
        }
        return null;
      },
      success: HomeActions.updateHome,
      error: HomeActions.fetchFailed,
      loading: HomeActions.fetchHomeBySlug
    };
  }
};

export default HomeSource;
