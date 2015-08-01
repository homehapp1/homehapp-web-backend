'use strict';

import React from 'react';
import { Link } from 'react-router';

class Header extends React.Component {
  render() {
    return (
      <div id='header'>
        <Link to='app' className='logo'>
          <img src='/public/images/homehapp-logo.svg' alt='Homehapp' />
        </Link>
        <div id='navigation'>Nav component here</div>
      </div>
    );
  }
}

export default Header;
