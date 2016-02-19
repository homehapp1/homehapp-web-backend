import alt from '../../common/alt';

@alt.createActions
class HomeActions {
  createItem(item) {
    this.dispatch(item);
  }
  createSuccess(count) {
    this.dispatch(count);
  }
  updateItem(item) {
    this.dispatch(item);
  }
  updateSuccess(count) {
    this.dispatch(count);
  }
  deleteItem(item) {
    this.dispatch(item);
  }
  deleteSuccess(count) {
    this.dispatch(count);
  }
  fetchItem(id) {
    this.dispatch(id);
  }
  requestFailed(error) {
    this.dispatch(error);
  }
}

module.exports = HomeActions;
