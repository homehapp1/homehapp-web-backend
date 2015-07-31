import superagent from 'superagent';

import ApplicationStore from './stores/ApplicationStore';

let setCommonDefaults = function(req) {
  req.accept( 'application/json');
  req.type('json');
};
let setPostingDefaults = function(req) {
  if (ApplicationStore.getState().csrf) {
    req.set('x-csrf-token', ApplicationStore.getState().csrf);
  }
  req.set('X-Requested-With', 'XMLHttpRequest');
};

module.exports = {
  superagent: superagent,
  get: function get(url) {
    let req = superagent.get(url);
    setCommonDefaults(req);
    return req;
  },
  head: function head(url) {
    let req = superagent.head(url);
    setCommonDefaults(req);
    return req;
  },
  del: function del(url) {
    let req = superagent.del(url);
    setCommonDefaults(req);
    return req;
  },
  patch: function patch(url) {
    let req = superagent.patch(url);
    setCommonDefaults(req);
    return req;
  },
  post: function post(url) {
    let req = superagent.post(url);
    setCommonDefaults(req);
    setPostingDefaults(req);
    return req;
  },
  put: function put(url) {
    let req = superagent.put(url);
    setCommonDefaults(req);
    setPostingDefaults(req);
    return req;
  }
};
