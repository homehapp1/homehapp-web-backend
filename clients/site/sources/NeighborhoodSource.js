import request from '../../common/request';
import NeighborhoodActions from '../actions/NeighborhoodActions';
// import Cache from '../../common/Cache';

let debug = require('../../common/debugger')('NeighborhoodSource');

let NeighborhoodSource = {
  fetchNeighborhoodBySlug: () => {
    return {
      remote(storeState, city, slug) {
        debug('fetchNeighborhoodBySlug:remote', arguments);
        return request.get(`/api/neighborhoods/${city}/${slug}`)
          .then((response) => {
            debug('got response');
            if (!response.data || !response.data.neighborhood) {
              let err = new Error('Invalid response');
              return Promise.reject(err);
            }
            // Cache.set('neighborhoodsBySlug', slug, response.data.neighborhood);
            return Promise.resolve(response.data.neighborhood);
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
      local(/*storeState, city, slug*/) {
        // if (Cache.has('neighborhoodsBySlug', slug)) {
        //   return Cache.get('neighborhoodsBySlug', slug);
        // }
        return null;
      },
      success: NeighborhoodActions.updateNeighborhood,
      error: NeighborhoodActions.fetchFailed,
      loading: NeighborhoodActions.fetchNeighborhoodBySlug
    };
  }
};

export default NeighborhoodSource;
