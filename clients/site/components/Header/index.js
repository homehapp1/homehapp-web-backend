'use strict';

import React from 'react';
import { Link } from 'react-router';
import DOMManipulator from '../../../common/DOMManipulator';
import { scrollTop } from '../../../common/Helpers';
import ApplicationStore from '../../../common/stores/ApplicationStore';

export default class Header extends React.Component {
  constructor() {
    super();
    this.config = ApplicationStore.getState().config;
    this.onScrollTop = this.onScrollTop.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScrollTop);
    window.addEventListener('mouseover', this.onMouseOver);
    this.header = new DOMManipulator(this.refs.header);
    this.prevTop = scrollTop();
    this.onScrollTop();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScrollTop);
    window.removeEventListener('mouseover', this.onMouseOver);
  }

  onMouseOver() {
    this.header.removeClass('away');
  }

  // Generic stuff that should happen on scrollTop
  onScrollTop() {
    let top = scrollTop();

    if (top < this.prevTop || top < this.header.height()) {
      this.header.removeClass('away');
    } else {
      this.header.addClass('away');
    }

    this.prevTop = top;
  }


  render() {
    return (
      <div id='header' ref='header'>
        <Link to='app' className='logo'>
          <img className='logo' src={this.config.revisionedStaticPath + '/images/homehapp-logo-horizontal.svg'} alt='Homehapp' />
        </Link>
      </div>
    );
  }
}
