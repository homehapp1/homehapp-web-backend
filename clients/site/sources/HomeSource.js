'use strict';

import request from '../../common/request';
import HomeActions from '../actions/HomeActions';

let debug = require('../../common/debugger')('HomeSource');

// Dummy cache
let homesCache = {};

let HomeSource = {
  fetchHomeBySlug: () => {
    debug('fetchHomeBySlug');
    return {
      remote(store, slug) {
        debug('fetchHomeBySlug:remote', arguments);
        return request.get(`/api/home/${slug}`)
          .then((response) => {
            //debug('got response', response);
            if (!response.data || !response.data.home) {
              err = new Error('Invalid response');
              return Promise.reject(err);
            }
            homesCache[slug] = response.data.home;
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
      local(store, slug) {
        debug('fetchHomeBySlug:local', arguments);
        if (homesCache[slug]) {
          return homesCache[slug];
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
