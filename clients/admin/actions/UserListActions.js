'use strict';

import alt from '../../common/alt';

let debug = require('../../common/debugger')('UserListActions');

@alt.createActions
class UserListActions {
  updateUsers(users) {
    this.dispatch(users);
  }
  fetchUsers(skipCache) {
    debug('fetchUsers', skipCache);
    this.dispatch(skipCache);
  }
  fetchFailed(error) {
    debug('fetchFailed', error);
    this.dispatch(error);
  }
}

module.exports = UserListActions;
