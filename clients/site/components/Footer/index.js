'use strict';

import React from 'react';
import { Link } from 'react-router';
import Image from '../../../common/components/Widgets/Image';

export default class Footer extends React.Component {
  render() {
    return (
      <div id='footer' className='clearfix' ref='footer'>
        <div className='width-wrapper'>
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
                <i className='fa fa-facebook-square'></i>
              </a>
            </li>
            <li>
              <a href='https://www.twitter.com/homehapp' target='_blank'>
                <i className='fa fa-twitter'></i>
              </a>
            </li>
            <li>
              <a href='https://www.instagram.com/homehapp' target='_blank'>
                <i className='fa fa-instagram'></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
