import React from 'react';

import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import AuthStore from '../../../common/stores/AuthStore';

let debug = require('debug')('Logout');

export default class Logout extends React.Component {
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
    this.setState(state);
  }

  logout() {
    return new Promise((resolve, reject) => {
      let req = new XMLHttpRequest();
      req.addEventListener('load', function logoutSuccess() {
        resolve();
      });
      req.addEventListener('error', function logoutError() {
        resolve();
      });
      req.open('GET', '/auth/logout');
      req.send();
    });
  }

  componentDidMount() {
    AuthStore.listen(this.storeListener);
    this.logout()
    .then(() => {
      try {
        AuthStore.fetchUser();
      } catch (error) {
        debug('AuthStore.fetchUser failed as expected', error);
      }

      this.setState({
        user: null,
        error: null,
        loggedIn: false
      });
    });
  }

  componentWillUnmount() {
    AuthStore.unlisten(this.storeListener);
  }

  render() {
    if (this.state.loggedIn) {
      return (
        <ContentBlock>
          <div id='loginForm' className='centered'>
            <h1>Logging out...</h1>
            <p>Please wait</p>
          </div>
        </ContentBlock>
      );
    }

    return (
      <ContentBlock className='centered'>
        <div className='centered'>
          <h1>Logged out</h1>
          <p>You have been successfully logged out</p>
        </div>
      </ContentBlock>
    );
  }
}
