import request from '../../common/request';
import ContactActions from '../actions/ContactActions';

let debug = require('../../common/debugger')('ContactSource');

let ContactSource = {
  createItem: function () {
    return {
      remote(storeState, data) {
        debug('createItem:remote', arguments, data);
        let postData = {
          contact: data
        };
        return request.post(`/api/contacts`, postData)
          .then((response) => {
            debug('got response', response);
            if (!response.data || response.data.status !== 'ok') {
              let err = new Error(response.data.error || 'Invalid response');
              return Promise.reject(err);
            }
            return Promise.resolve(response.data.contact);
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
      success: ContactActions.createSuccess,
      error: ContactActions.requestFailed,
      loading: ContactActions.createItem
    };
  }
};

export default ContactSource;
