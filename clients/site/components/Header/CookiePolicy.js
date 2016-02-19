import React from 'react';
import { Link } from 'react-router';
import cookie from 'react-cookie';

let debug = require('debug')('CookiePolicy');

export default class CookiePolicy extends React.Component {
  constructor() {
    super();
    this.approveCookieUsage = this.approveCookieUsage.bind(this);
    this.cookieName = 'acceptcookies';
  }

  state = {
    approved: cookie.load('approved')
  }

  componentDidMount() {
    let node = React.findDOMNode(this.refs.close);
    if (node) {
      debug('Bind click & touch');
      node.addEventListener('click', this.approveCookieUsage, true);
      node.addEventListener('touch', this.approveCookieUsage, true);
    }
  }

  approveCookieUsage() {
    debug('approveCookieUsage');
    let dt = (new Date()).toISOString();
    cookie.save(this.cookieName, dt);
    this.setState({
      approved: dt
    });
  }

  render() {
    if (cookie.load(this.cookieName)) {
      debug('Cookie saved, do not display the consent screen');
      return null;
    }

    return (
      <div id='cookiePolicy'>
        <p>
          <span className='close' ref='close'>×</span>
          This site uses cookies. By continuing to browse the site you are
          agreeing to our use of cookies. <Link to='page' params={{slug: 'privacy'}}>Find out more ›</Link>
        </p>
      </div>
    );
  }
}
