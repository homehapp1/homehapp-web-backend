import React from 'react';

import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import ApplicationStore from '../../../common/stores/ApplicationStore';

let debug = require('debug')('Login');

export default class Login extends React.Component {
  static propTypes = {
    context: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.func
  }

  constructor() {
    super();
    this.stateListener = this.onStateChange.bind(this);
  }

  componentDidMount() {
    if (!this.state.csrf) {
      ApplicationStore.getState();
    }
  }

  onStateChange(state) {
    debug('got state', state);
    this.setState(state);
  }

  state = {
    csrf: ApplicationStore.getState().csrf,
    redirectUrl: ApplicationStore.getState().redirectUrl
  }

  getRedirectUrl() {
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      let regs = window.location.search.match(/redirectUrl=(.+?)(&|$)/);
      if (regs && regs[1]) {
        return decodeURIComponent(regs[1]);
      }
    }

    if (this.state.redirectUrl) {
      return this.state.redirectUrl;
    }

    if (this.context && this.context.router) {
      return this.context.router.makeHref('homepage');
    }

    return '/';
  }

  render() {
    let url = this.getRedirectUrl();

    return (
      <ContentBlock>
        <div id='loginForm'>
          <h3>Login</h3>
          <form method='POST' action='/auth/login'>
            <div className='form'>
              <input type='hidden' name='_csrf' defaultValue={this.state.csrf} />
              <input type='hidden' name='redirectUrl' defaultValue={url} />
              <input type='email' name='username' required placeholder='Username' />
              <input type='password' name='password' required placeholder='Password' />
              <input type='submit' value='Login ›' />
            </div>
          </form>
        </div>
      </ContentBlock>
    );
  }
}
