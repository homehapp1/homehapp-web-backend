import alt from '../../common/alt';

@alt.createActions
class ContactListActions {
  updateContacts(contacts) {
    this.dispatch(contacts);
  }
  fetchContacts(skipCache) {
    this.dispatch(skipCache);
  }
  fetchFailed(error) {
    this.dispatch(error);
  }
}

module.exports = ContactListActions;
