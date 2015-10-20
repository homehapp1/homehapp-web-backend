import alt from '../../common/alt';
import UserListActions from '../actions/UserListActions';
import UserListSource from '../sources/UserListSource';
// import Cache from '../../common/Cache';

let debug = require('../../common/debugger')('UserListStore');

@alt.createStore
class UserListStore {
  constructor() {
    this.on('bootstrap', () => {
      debug('bootstrapping', this.users);
    });

    this.bindListeners({
      handleUpdateUsers: UserListActions.UPDATE_USERS,
      handleFetchUsers: UserListActions.FETCH_USERS,
      handleFetchFailed: UserListActions.FETCH_FAILED
    });

    this.users = [];
    this.error = null;

    this.exportPublicMethods({
      getUser: this.getUser
    });

    this.exportAsync(UserListSource);
  }

  getUser(id) {
    debug('getUser', id);
    let { users } = this.getState();
    for (let user of users) {
      if (!id) {
        return user;
      }
      if (user.id === id) {
        return user;
      }
    }
    debug('No matching id found in users');
    this.error = 'No matching id found in users';
  }

  handleUpdateUsers(users) {
    debug('handleUpdateUsers', users);
    this.users = users;
    this.error = null;
  }
  handleFetchUsers() {
    debug('handleFetchUsers');
    this.users = [];
    this.error = null;
  }
  handleFetchFailed(error) {
    debug('handleFetchFailed', error);
    this.error = error;
  }
}

module.exports = UserListStore;
