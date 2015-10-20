import request from '../../common/request';
import ContactListActions from '../actions/ContactListActions';

let debug = require('../../common/debugger')('ContactListSource');

let ContactListSource = {
  fetchContacts: () => {
    return {
      remote(/*storeState*/) {
        debug('fetchContacts:remote', arguments);
        return request.get(`/api/contacts`)
          .then((response) => {
            debug('got response', response);
            if (!response.data || !response.data.contacts) {
              let err = new Error('Invalid response');
              return Promise.reject(err);
            }
            return Promise.resolve(response.data.contacts);
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
      success: ContactListActions.updateContacts,
      error: ContactListActions.fetchFailed,
      loading: ContactListActions.fetchContacts
    };
  }
};

export default ContactListSource;
