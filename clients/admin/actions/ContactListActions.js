import alt from '../../common/alt';

let debug = require('../../common/debugger')('ContactListActions');

@alt.createActions
class ContactListActions {
  updateContacts(contacts) {
    this.dispatch(contacts);
  }
  fetchContacts(skipCache) {
    debug('fetchContacts', skipCache);
    this.dispatch(skipCache);
  }
  fetchFailed(error) {
    debug('fetchFailed', error);
    this.dispatch(error);
  }
}

module.exports = ContactListActions;
