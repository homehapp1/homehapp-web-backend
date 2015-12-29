import alt from '../../common/alt';
import NewsletterActions from '../actions/NewsletterActions';
import NewsletterSource from '../sources/NewsletterSource';
// import Cache from '../../common/Cache';

let debug = require('../../common/debugger')('NewsletterStore');

@alt.createStore
class NewsletterStore {
  constructor() {
    this.on('bootstrap', () => {
      debug('bootstrapping', this.newsletter);
    });

    this.bindListeners({
      handleCreateItem: NewsletterActions.CREATE_ITEM,
      handleRequestFailed: NewsletterActions.REQUEST_FAILED,
      handleCreateSuccess: NewsletterActions.CREATE_SUCCESS
    });

    this.error = null;
    this.newsletter = null;
    this.deleted = false;
    this.exportAsync(NewsletterSource);
  }

  handleCreateItem(item) {
    debug('handleCreateItem', item);
    this.error = null;
    this.newsletter = null;
    if (!this.getInstance().isLoading()) {
      setTimeout(() => {
        this.getInstance().createItem(item);
      });
    }
  }
  handleCreateSuccess(newsletter) {
    debug('handleCreateSuccess', newsletter);
    this.error = null;
    this.newsletter = newsletter;
    this.emitChange();
  }

  handleRequestFailed(error) {
    debug('handleRequestFailed', error);
    this.error = error;
  }
}

module.exports = NewsletterStore;
