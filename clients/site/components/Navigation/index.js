'use strict';

import React from 'react';
import { Link } from 'react-router';
import DOMManipulator from '../../../common/DOMManipulator';

export default class Navigation extends React.Component {
  constructor() {
    super();
    this.click = this.click.bind(this);
    this.hideNavigation = this.hideNavigation.bind(this);
    this.body = null;
  }

  componentDidMount() {
    this.icon = new DOMManipulator(this.refs.icon);
    this.icon.addEvent('touchstart', this.click, true);
    this.icon.addEvent('mousedown', this.click, true);

    this.container = new DOMManipulator(this.refs.container);
    this.container.addEvent('touchstart', this.hideNavigation, false);
    this.container.addEvent('mousedown', this.hideNavigation, false);

    this.navigation = new DOMManipulator(this.refs.navigation);
  }

  componentWillUnmount() {
    this.icon.removeEvent('touchstart', this.click, true);
    this.icon.removeEvent('mousedown', this.click, true);
    this.container.removeEvent('touchstart', this.hideNavigation, false);
    this.container.removeEvent('mousedown', this.hideNavigation, false);
  }

  hideNavigation() {
    this.icon.removeClass('open');
    this.navigation.removeClass('open');
    this.body.removeClass('no-scroll-small').removeClass('away-for-small');
  }

  showNavigation() {
    this.icon.addClass('open');
    this.navigation.addClass('open');
    this.body.addClass('no-scroll-small').addClass('away-for-small');
  }

  click(e) {
    this.body = new DOMManipulator(document.getElementsByTagName('body')[0]);

    if (this.navigation.hasClass('open')) {
      this.hideNavigation();
    } else {
      this.showNavigation();
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
        <div className='container' ref='container'>
          <ul>
            <li><Link to='properties'>Buy</Link></li>
            <li><Link to='propertiesMode' params={{mode: 'rent'}}>Rent</Link></li>
            <li>
              <Link to='neighborhoods'>Neighbourhoods</Link>
              <ul>
                <li><Link to='neighborhoodsView' params={{city: 'london', neighborhood: 'stjohnswood'}}>St. John´s Wood</Link></li>
              </ul>
            </li>
            <li className='secondary'><Link to='contentAbout'>About us</Link></li>
          </ul>
        </div>
      </div>
    );
  }
}
