import React from 'react';
import { Link } from 'react-router';
import Image from '../../../common/components/Widgets/Image';
import SocialMedia from '../Navigation/SocialMedia';

export default class Footer extends React.Component {
  render() {
    return (
      <div id='footer' className='clearfix full-height' ref='footer'>
        <div className='width-wrapper'>
          homehapp Limited. All rights reserved 2015. Contact, collaboration and inquiries: <a href='mailto:hello@homehapp.com'>hello@homehapp.com</a>
        </div>
      </div>
    );
  }
}
