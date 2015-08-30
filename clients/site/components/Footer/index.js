'use strict';

import React from 'react';
import { Link } from 'react-router';
import Image from '../../../common/components/Widgets/Image';

class Footer extends React.Component {
  render() {
    return (
      <div id='footer' className='clearfix' ref='footer'>
        <div className='width-wrapper'>
          <h3 ref='footerIcon'>
            <Image src='images/homehapp-symbol.svg' alt='H' type='asset' />
          </h3>
          <Image src='images/homehapp-logotype-gray.svg' alt='Homehapp' type='asset' className='logotype' />
          <ul className='footer-links main'>
            <li><Link to='content' params={{slug: 'about'}}>About us</Link></li>
            <li><Link to='content' params={{slug: 'terms'}}>Terms & conditions</Link></li>
            <li><Link to='content' params={{slug: 'privacy'}}>Privacy policy</Link></li>
            <li><Link to='content' params={{slug: 'careers'}}>Careers</Link></li>
          </ul>
          <ul className='footer-links social'>
            <li>
              <a href='https://www.facebook.com/homehapp' target='_blank'>
                <Image src='images/icons/facebook.svg' alt='Facebook' type='asset' />
              </a>
            </li>
            <li>
              <a href='https://www.twitter.com/homehapp' target='_blank'>
                <Image src='images/icons/twitter.svg' alt='Twitter' type='asset' />
              </a>
            </li>
            <li>
              <a href='https://www.instagram.com/homehapp' target='_blank'>
                <Image src='images/icons/instagram.svg' alt='Instagram' type='asset' />
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Footer;
