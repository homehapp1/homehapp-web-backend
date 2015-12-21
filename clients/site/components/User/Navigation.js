import React from 'react';
import { Link } from 'react-router';

import AuthStore from '../../../common/stores/AuthStore';
let debug = require('debug')('UserNavigation');

export default class UserNavigation extends React.Component {
  constructor() {
    super();
    this.storeListener = this.onStoreChange.bind(this);
  }

  state = {
    user: AuthStore.getState().user,
    loggedIn: AuthStore.getState().loggedIn,
    error: AuthStore.getState().error
  }

  onStoreChange(state) {
    debug('got state', state);
    this.setState(state);
  }

  componentDidMount() {
    AuthStore.listen(this.storeListener);
    debug('AuthStore', AuthStore.getState());

    if (this.state.loggedIn === null) {
      AuthStore.fetchUser();
    }
  }

  componentWillUnmount() {
    AuthStore.unlisten(this.storeListener);
  }

  render() {
    if (this.state.user) {
      return (
        <div className='user-profile logged-in'>
          <Link to='logout'>Log out</Link>
        </div>
      );
    }

    return (
      <div className='user-profile login'>
        <Link to='login'>Log in</Link>
      </div>
    );
  }
}
