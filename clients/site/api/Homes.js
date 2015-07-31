'use strict';

import request from '../../common/request';
import {batchedCallback} from '../../common/Helpers';

let debug = require('../../common/debugger')('HomeAPI');

let HomesAPI = {
  fetch: function(data) {
    debug('fetch', data);
    let slug = data.slug;
    delete data.slug;
    return new Promise((resolve, reject) => {
      request.get(`/api/home/${slug}`)
      .send(data)
      .end(batchedCallback(function(err, res) {
        debug('got here', err, res.body);
        if (err) {
          if (res && res.body && res.body.error) {
            err = new Error(res.body.error);
            err.status = res.status;
            err.data = res.body.data;
          }
          return reject(err);
        }

        if (!res.body || !res.body.home) {
          err = new Error('Invalid response');
          return reject(err);
        }
        resolve(res.body);
      }));
    });
  }
};

export default HomesAPI;
