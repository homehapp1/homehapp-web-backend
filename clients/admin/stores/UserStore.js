import alt from '../../common/alt';
import UserActions from '../actions/UserActions';
import UserSource from '../sources/UserSource';
// import Cache from '../../common/Cache';

// let debug = require('../../common/debugger')('UserStore');

@alt.createStore
class UserStore {
  constructor() {
    this.bindListeners({
      handleCreateItem: UserActions.CREATE_ITEM,
      handleUpdateItem: UserActions.UPDATE_ITEM,
      handleDeleteItem: UserActions.DELETE_ITEM,
      handleRequestFailed: UserActions.REQUEST_FAILED,
      handleCreateSuccess: UserActions.CREATE_SUCCESS,
      handleUpdateSuccess: UserActions.UPDATE_SUCCESS,
      handleDeleteSuccess: UserActions.DELETE_SUCCESS
    });

    this.error = null;
    this.user = null;
    this.deleted = false;
    this.exportAsync(UserSource);
  }

  handleCreateItem(item) {
    this.error = null;
    this.user = null;
    if (!this.getInstance().isLoading()) {
      setTimeout(() => {
        this.getInstance().createItem(item);
      });
    }
  }
  handleCreateSuccess(user) {
    this.error = null;
    this.user = user;
    this.emitChange();
  }

  handleUpdateItem(item) {
    this.error = null;
    if (!this.getInstance().isLoading()) {
      setTimeout(() => {
        this.getInstance().updateItem(item);
      });
    }
  }
  handleUpdateSuccess(user) {
    this.error = null;
    this.user = user;
    this.emitChange();
  }
  handleDeleteItem(item) {
    this.error = null;
    this.deleted = false;
    if (!this.getInstance().isLoading()) {
      setTimeout(() => {
        this.getInstance().deleteItem(item);
      });
    }
  }
  handleDeleteSuccess(user) {
    this.error = null;
    this.user = null;
    this.deleted = true;
    this.emitChange();
  }

  handleRequestFailed(error) {
    this.error = error;
  }
}

module.exports = UserStore;
