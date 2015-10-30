import React from 'react';
import { Link } from 'react-router';
import Image from '../../../common/components/Widgets/Image';
import SocialMedia from '../Navigation/SocialMedia';

export default class Footer extends React.Component {
  render() {
    return (
      <div id='footer' className='clearfix' ref='footer'>
        <div className='width-wrapper'>
          <Image src='images/homehapp-logotype-gray.svg' alt='Homehapp' type='asset' className='logotype' />
          <ul className='footer-links main'>
            <li><Link to='page' params={{slug: 'about'}}>About us</Link></li>
            <li><Link to='page' params={{slug: 'terms'}}>Terms & conditions</Link></li>
            <li><Link to='page' params={{slug: 'privacy'}}>Privacy policy</Link></li>
            <li><Link to='page' params={{slug: 'careers'}}>Careers</Link></li>
          </ul>
          <SocialMedia className='footer-links' />
        </div>
      </div>
    );
  }
}
