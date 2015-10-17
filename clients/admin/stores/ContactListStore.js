

import alt from '../../common/alt';
import ContactListActions from '../actions/ContactListActions';
import ContactListSource from '../sources/ContactListSource';
// import Cache from '../../common/Cache';

let debug = require('../../common/debugger')('ContactListStore');

@alt.createStore
class ContactListStore {
  constructor() {
    this.on('bootstrap', () => {
      debug('bootstrapping', this.contacts);
    });

    this.bindListeners({
      handleUpdateContacts: ContactListActions.UPDATE_CONTACTS,
      handleFetchContacts: ContactListActions.FETCH_CONTACTS,
      handleFetchFailed: ContactListActions.FETCH_FAILED
    });

    this.contacts = [];
    this.error = null;

    this.exportPublicMethods({
      getContact: this.getContact
    });

    this.exportAsync(ContactListSource);
  }

  getContact(id) {
    debug('getContact', id);
    let { contacts } = this.getState();
    for (let contact of contacts) {
      if (!id) {
        return contact;
      }
      if (contact.id === id) {
        return contact;
      }
    }
    debug('No matching id found in contacts');
    this.error = 'No matching id found in contacts';
  }

  handleUpdateContacts(contacts) {
    debug('handleUpdateContacts', contacts);
    this.contacts = contacts;
    this.error = null;
  }
  handleFetchContacts() {
    debug('handleFetchContacts');
    this.contacts = [];
    this.error = null;
  }
  handleFetchFailed(error) {
    debug('handleFetchFailed', error);
    this.error = error;
  }
}

module.exports = ContactListStore;
