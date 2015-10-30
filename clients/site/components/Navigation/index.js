import React from 'react';
import { Link } from 'react-router';
import DOMManipulator from '../../../common/DOMManipulator';

// let debug = require('debug')('Navigation');

export default class Navigation extends React.Component {
  constructor() {
    super();
    this.click = this.click.bind(this);
    this.hideNavigation = this.hideNavigation.bind(this);
    this.body = null;

    // Bind to self
    this.hideNavigation = this.hideNavigation.bind(this);
    this.showNavigation = this.showNavigation.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
  }

  componentDidMount() {
    this.container = new DOMManipulator(this.refs.container);
    this.body = new DOMManipulator(document.getElementsByTagName('body')[0]);

    // Icon actions
    this.icon = new DOMManipulator(this.refs.icon);
    this.icon.addEvent('touchstart', this.click, true);
    this.icon.addEvent('mousedown', this.click, true);

    // Navigation actions
    this.navigation = new DOMManipulator(this.refs.navigation);
    this.navigation.addEvent('mouseover', this.showNavigation, true);
    this.navigation.addEvent('mouseout', this.hideNavigation, false);

    // Navigation links
    this.links = this.navigation.getByTagName('a');
    for (let link of this.links) {
      link.addEvent('click', this.hideNavigation.bind(this));
      link.addEvent('touch', this.hideNavigation.bind(this));
    }

    this.body = new DOMManipulator(document.getElementsByTagName('body')[0]);
  }

  componentWillUnmount() {
    // Remove events
    this.icon.removeEvent('touch', this.click, true);
    this.icon.removeEvent('click', this.click, true);
    this.navigation.removeEvent('mouseover', this.showNavigation, true);
    this.navigation.removeEvent('mouseout', this.hideNavigation, false);
  }

  onDocumentClick(event) {
    // debug('onDocumentClick', event);
    let target = event.target;

    // Check if inside navigation
    while (target.parentNode) {
      if (target.id === 'navigation') {
        return true;
      }

      target = target.parentNode;
    }

    // Otherwise catch the event, hide navigation and remove the self
    event.preventDefault();
    event.stopPropagation();
    this.hideNavigation();
  }

  hideNavigation() {
    // debug('hideNavigation', event);
    this.icon.removeClass('open');
    this.navigation.removeClass('open');
    this.body.removeClass('no-scroll-small').removeClass('away-for-small');
    document.removeEventListener('mousedown', this.onDocumentClick, true);
    document.removeEventListener('touchstart', this.onDocumentClick, true);
    return true;
  }

  showNavigation() {
    this.icon.addClass('open');
    this.navigation.addClass('open');
    this.body.addClass('no-scroll-small').addClass('away-for-small');
    document.addEventListener('mousedown', this.onDocumentClick, true);
    document.addEventListener('touchstart', this.onDocumentClick, true);
  }

  click(event) {
    // debug('body hasclass', this.body.hasClass('no-scroll-small'));
    if (this.body.hasClass('no-scroll-small')) {
      this.hideNavigation(event);
    } else {
      this.showNavigation(event);
    }

    event.preventDefault();
    event.stopPropagation();
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
            <li><Link to='searchMode' params={{mode: 'buy'}}>Buy</Link></li>
            <li><Link to='searchMode' params={{mode: 'rent'}}>Rent</Link></li>
            <li><Link to='contactSelling'>Sell</Link></li>
            <li><Link to='contactLetting'>Let</Link></li>
            <li><Link to='homeStories'>Home stories</Link></li>
            <li>
              <Link to='neighborhoodList' params={{city: 'london'}}>Neighbourhoods</Link>
            </li>
            <li className='secondary'><Link to='page' params={{slug: 'about'}}>About us</Link></li>
            <li className='secondary'><Link to='page' params={{slug: 'why-homehapp'}}>Why Homehapp</Link></li>
            <li className='secondary'><Link to='page' params={{slug: 'careers'}}>Careers</Link></li>
          </ul>
          <ul className='secondary social'>
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
