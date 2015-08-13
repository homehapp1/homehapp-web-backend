'use strict';

import React from 'react';
import { Link } from 'react-router';
import Navigation from './Navigation';

class Header extends React.Component {
  render() {
    return (
      <div id='header'>
        <Link to='app' className='logo'>
          <img src='/public/images/homehapp-logo.svg' alt='Homehapp' />
        </Link>
        <Navigation />
      </div>
    );
  }
}

export default Header;
