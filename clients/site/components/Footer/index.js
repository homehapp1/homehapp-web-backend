'use strict';

import React from 'react';
import { Link } from 'react-router';

class Footer extends React.Component {
  render() {
    return (
      <div id='footer'>
        <div className='width-wrapper'>
          <h3><img src='/public/images/homehapp-logo-horizontal.svg' alt='Homehapp' /></h3>
          <ul className='footer-links'>
            <li><Link to='app'>Lorem ipsum</Link></li>
            <li><Link to='app'>Lorem ipsum</Link></li>
            <li><Link to='app'>Lorem ipsum</Link></li>
            <li><Link to='app'>Lorem ipsum</Link></li>
            <li><Link to='app'>Lorem ipsum</Link></li>
            <li><Link to='app'>Lorem ipsum</Link></li>
            <li><Link to='app'>Lorem ipsum</Link></li>
            <li><Link to='app'>Lorem ipsum</Link></li>
            <li><Link to='app'>Lorem ipsum</Link></li>
            <li><Link to='app'>Lorem ipsum</Link></li>
            <li><Link to='app'>Lorem ipsum</Link></li>
            <li><Link to='app'>Lorem ipsum</Link></li>
            <li><Link to='app'>Lorem ipsum</Link></li>
            <li><Link to='app'>Lorem ipsum</Link></li>
            <li><Link to='app'>Lorem ipsum</Link></li>
            <li><Link to='app'>Lorem ipsum</Link></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Footer;
