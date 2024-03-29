import alt from '../../common/alt';
import ContactListActions from '../actions/ContactListActions';
import ContactListSource from '../sources/ContactListSource';
// import Cache from '../../common/Cache';

// let debug = require('../../common/debugger')('ContactListStore');

@alt.createStore
class ContactListStore {
  constructor() {
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
    let { contacts } = this.getState();
    for (let contact of contacts) {
      if (!id) {
        return contact;
      }
      if (contact.id === id) {
        return contact;
      }
    }
    this.error = 'No matching id found in contacts';
  }

  handleUpdateContacts(contacts) {
    this.contacts = contacts;
    this.error = null;
  }
  handleFetchContacts() {
    this.contacts = [];
    this.error = null;
  }
  handleFetchFailed(error) {
    this.error = error;
  }
}

module.exports = ContactListStore;
