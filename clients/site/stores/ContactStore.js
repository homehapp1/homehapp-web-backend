import alt from '../../common/alt';
import ContactActions from '../actions/ContactActions';
import ContactSource from '../sources/ContactSource';
// import Cache from '../../common/Cache';

let debug = require('../../common/debugger')('ContactStore');

@alt.createStore
class ContactStore {
  constructor() {
    this.on('bootstrap', () => {
      debug('bootstrapping', this.contact);
    });

    this.bindListeners({
      handleCreateItem: ContactActions.CREATE_ITEM,
      handleRequestFailed: ContactActions.REQUEST_FAILED,
      handleCreateSuccess: ContactActions.CREATE_SUCCESS
    });

    this.error = null;
    this.contact = null;
    this.deleted = false;
    this.exportAsync(ContactSource);
  }

  handleCreateItem(item) {
    debug('handleCreateItem', item);
    this.error = null;
    this.contact = null;
    if (!this.getInstance().isLoading()) {
      setTimeout(() => {
        this.getInstance().createItem(item);
      });
    }
  }
  handleCreateSuccess(contact) {
    debug('handleCreateSuccess', contact);
    this.error = null;
    this.contact = contact;
    this.emitChange();
  }

  handleRequestFailed(error) {
    debug('handleRequestFailed', error);
    this.error = error;
  }
}

module.exports = ContactStore;
