'use strict';

import React from 'react';
import { Link } from 'react-router';
import DOMManipulator from '../../../common/DOMManipulator';
import { scrollTop } from '../../../common/Helpers';


class Header extends React.Component {
  constructor() {
    super();
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

  onMouseOver(e) {
    this.header.removeClass('away');
  }

  // Generic stuff that should happen on scrollTop
  onScrollTop() {
    let top = scrollTop();
    let header = document.getElementById('header');

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
          <img className='logo' src='/public/images/homehapp-logo-horizontal.svg' alt='Homehapp' />
        </Link>
      </div>
    );
  }
}

export default Header;
