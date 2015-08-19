'use strict';

import React from 'react';
import { Link } from 'react-router';
import ApplicationStore from '../../../common/stores/ApplicationStore';

class Footer extends React.Component {
  constructor() {
    super();
    this.config = ApplicationStore.getState().config;
  }

  render() {
    return (
      <div id='footer' className='clearfix'>
        <div className='width-wrapper'>
          <h3><img src={this.config.revisionedStaticPath + '/images/homehapp-logotype-gray.svg'} alt='Homehapp' /></h3>
          <ul className='footer-links'>
            <li><Link to='content' params={{slug: 'about'}}>About</Link></li>
            <li><Link to='content' params={{slug: 'terms'}}>Terms & conditions</Link></li>
            <li><Link to='content' params={{slug: 'privacy'}}>Privacy policy</Link></li>
            <li><Link to='content' params={{slug: 'careers'}}>Careers</Link></li>
          </ul>
          <ul className='footer-links social'>
            <li>
              <a href='https://www.facebook.com/homehapp' target='_blank'>
                <img src={this.config.revisionedStaticPath + '/images/icons/facebook.svg'} />
              </a>
            </li>
            <li>
              <a href='https://www.twitter.com/homehapp' target='_blank'>
                <img src={this.config.revisionedStaticPath + '/images/icons/twitter.svg'} />
              </a>
            </li>
            <li>
              <a href='https://www.instagram.com/homehapp' target='_blank'>
                <img src={this.config.revisionedStaticPath + '/images/icons/instagram.svg'} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Footer;
