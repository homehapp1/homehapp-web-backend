'use strict';

import React from 'react';
import { Link } from 'react-router';
import { hasClass, addClass, removeClass } from '../../../common/Helpers';

class Navigation extends React.Component {
  constructor() {
    super();
    this.mouseover = this.mouseover.bind(this);
    this.mouseout = this.mouseout.bind(this);
    this.click = this.click.bind(this);
  }

  mouseover() {
    console.log('mouseover');

    if (!hasClass(this.icon, 'open')) {
      addClass(this.icon, 'loading');
    }
  }

  mouseout() {
    removeClass(this.icon, 'loading');
  }

  click() {
    console.log('click');

    if (hasClass(this.icon, 'open')) {
      removeClass(this.icon, 'open');
    } else {
      removeClass(this.icon, 'loading');
      addClass(this.icon, 'open');
    }
  }

  componentDidMount() {
    this.icon = this.refs.icon.getDOMNode();
    this.icon.addEventListener('mouseover', this.mouseover, true);
    this.icon.addEventListener('mouseout', this.mouseout, true);
    this.icon.addEventListener('click', this.click, true);
  }
  render() {
    return (
      <div id='navigation'>
        <div ref='icon' className='icon'>
          <div className='bar top'></div>
          <div className='bar middle'></div>
          <div className='bar bottom'></div>
        </div>
      </div>
    );
  }
}

export default Navigation;
