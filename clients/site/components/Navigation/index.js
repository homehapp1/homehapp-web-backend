'use strict';

import React from 'react';
import { Link } from 'react-router';
import DOMManipulator from '../../../common/DOMManipulator';

class Navigation extends React.Component {
  constructor() {
    super();
    this.mouseover = this.mouseover.bind(this);
    this.mouseout = this.mouseout.bind(this);
    this.click = this.click.bind(this);
    this.toggle = this.toggle.bind(this);
    this.body = null;
  }

  componentDidMount() {
    this.icon = new DOMManipulator(this.refs.icon);
    this.icon.addEvent('mouseover', this.mouseover);
    this.icon.addEvent('mouseout', this.mouseout);
    this.icon.addEvent('click', this.click, true);

    this.navigation = new DOMManipulator(this.refs.navigation);
  }

  componentWillUnmount() {
    this.icon.removeEvent('mouseover', this.mouseover);
    this.icon.removeEvent('mouseout', this.mouseout);
    this.icon.removeEvent('click', this.click, true);
  }

  hideNavigation() {
    document.removeEventListener('click', this.toggle, false);
    document.removeEventListener('touch', this.toggle, false);
    this.navigation.removeClass('open');
    this.icon.removeClass('open');

    if (this.body) {
      this.body.removeClass('no-scroll-small').removeClass('away-for-small');
    }
  }

  toggle(e) {
    this.hideNavigation();
    for (let i = 0; i < e.path.length; i++) {
      // Allow default action for anything inside navigation
      if (e.path[i].id === 'navigation') {
        return true;
      }
    }

    // Otherwise prevent default actions on the first click
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  mouseover() {
    if (!this.navigation.hasClass('open')) {
      this.icon.addClass('loading');
    }
  }

  mouseout() {
    this.icon.removeClass('loading');
  }

  click(e) {
    this.body = new DOMManipulator(document.getElementsByTagName('body')[0]);

    if (this.navigation.hasClass('open')) {
      this.hideNavigation();
    } else {
      this.icon.removeClass('loading').addClass('open');
      this.navigation.addClass('open');

      document.addEventListener('click', this.toggle, false);
      document.addEventListener('touch', this.toggle, false);
      this.body.addClass('no-scroll-small').addClass('away-for-small');
    }

    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  render() {
    return (
      <div id='navigation' ref='navigation'>
        <div ref='icon' className='icon'>
          <div className='bar top'></div>
          <div className='bar middle'></div>
          <div className='bar bottom'></div>
        </div>
        <div className='container full-height-strict'>
          <ul>
            <li><Link to='properties'>Buy</Link></li>
            <li><Link to='propertiesMode' params={{mode: 'cards'}}>Sell</Link></li>
            <li><Link to='propertiesMode' params={{mode: 'list'}}>Sell</Link></li>
            <li><Link to='propertiesMode' params={{mode: 'single'}}>Sell</Link></li>
            <li><Link to='content' params={{slug: 'about-us'}}>About us</Link></li>
            <li><Link to='content' params={{slug: 'terms'}}>Terms & conditions</Link></li>
            <li><Link to='content' params={{slug: 'privacy'}}>Privacy</Link></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Navigation;
