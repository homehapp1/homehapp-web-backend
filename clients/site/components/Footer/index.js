'use strict';

import React from 'react';
import { Link } from 'react-router';
import ApplicationStore from '../../../common/stores/ApplicationStore';
import DOMManipulator from '../../../common/DOMManipulator';

class Footer extends React.Component {
  constructor() {
    super();
    this.config = ApplicationStore.getState().config;
    this.displayFooter = this.displayFooter.bind(this);
    this.toggleFooter = this.toggleFooter.bind(this);
    this.hideFooter = this.hideFooter.bind(this);
  }

  componentDidMount() {
    this.footer = this.refs.footer.getDOMNode();
    this.icon = this.refs.footerIcon.getDOMNode();

    // this.footer.addEventListener('mouseover', this.displayFooter);
    // this.footer.addEventListener('mouseout', this.hideFooter);
    this.icon.addEventListener('click', this.toggleFooter);
    this.icon.addEventListener('touch', this.toggleFooter);
  }

  componentWillUnmount() {
    // this.footer.removeEventListener('mouseover', this.displayFooter);
    // this.footer.removeEventListener('mouseout', this.hideFooter);
    this.icon.removeEventListener('click', this.toggleFooter);
    this.icon.removeEventListener('touch', this.toggleFooter);
  }

  toggleFooter() {
    let footer = new DOMManipulator(this.footer);

    if (footer.hasClass('visible')) {
      footer.removeClass('visible');
    } else {
      footer.addClass('visible');
    }
  }

  displayFooter() {
    (new DOMManipulator(this.footer)).addClass('visible');
  }

  hideFooter() {
    (new DOMManipulator(this.footer)).removeClass('visible');
  }

  render() {
    return (
      <div id='footer' className='clearfix' ref='footer'>
        <div className='width-wrapper'>
          <h3 ref='footerIcon'><img src={this.config.revisionedStaticPath + '/images/homehapp-symbol.svg'} alt='H' /></h3>
          <ul className='footer-links main'>
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
