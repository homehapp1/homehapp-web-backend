'use strict';

import React from 'react';
import { Link } from 'react-router';

class Footer extends React.Component {
  render() {
    return (
      <div id='footer' className='clearfix'>
        <div className='width-wrapper'>
          <h3><img src='/public/images/homehapp-logotype-gray.svg' alt='Homehapp' /></h3>
          <ul className='footer-links'>
            <li><Link to='content' params={{slug: 'about'}}>About</Link></li>
            <li><Link to='content' params={{slug: 'terms'}}>Terms & conditions</Link></li>
            <li><Link to='content' params={{slug: 'privacy'}}>Privacy policy</Link></li>
            <li><Link to='content' params={{slug: 'careers'}}>Careers</Link></li>
          </ul>
          <ul className='footer-links social'>
            <li>
              <a href='https://www.facebook.com/homehapp' target='_blank'>
                <img src='/public/images/icons/facebook.svg' />
              </a>
            </li>
            <li>
              <a href='https://www.twitter.com/homehapp' target='_blank'>
                <img src='/public/images/icons/twitter.svg' />
              </a>
            </li>
            <li>
              <a href='https://www.instagram.com/homehapp' target='_blank'>
                <img src='/public/images/icons/instagram.svg' />
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Footer;
