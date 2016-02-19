import alt from '../../common/alt';

let debug = require('../../common/debugger')('NewsletterActions');

@alt.createActions
class NewsletterActions {
  createItem(item) {
    debug('createItem', item);
    this.dispatch(item);
  }
  createSuccess(count) {
    this.dispatch(count);
  }
  fetchItem(id) {
    debug('fetchItem', id);
    this.dispatch(id);
  }
  requestFailed(error) {
    debug('requestFailed', error);
    this.dispatch(error);
  }
}

module.exports = NewsletterActions;
