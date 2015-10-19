

import UsersEditDetails from './EditDetails';
import UserStore from '../../stores/UserStore';

let debug = require('../../../common/debugger')('UsersCreateDetails');

export default class UsersCreateDetails extends UsersEditDetails {
  onUserStoreChange(state) {
    debug('onUserStoreChange', state);
    let error = UserStore.getState().error;
    let user = UserStore.getState().user;

    if (error) {
      this.setState({
        error: error
      });
    }

    if (user && user.slug) {
      debug('Redirect to the newly created user');
      let href = this.context.router.makeHref('userEdit', {id: state.user.id});
      debug('Redirect url', href);
      window.location.href = href;
    }
  }
}
