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
  }

  mouseover() {
    console.log('mouseover');

    if (!this.icon.hasClass('open')) {
      this.icon.addClass('loading');
    }
  }

  mouseout() {
    this.icon.removeClass('loading');
  }

  click() {
    console.log('click');

    if (this.icon.hasClass('open')) {
      this.icon.removeClass('open');
    } else {
      this.icon.removeClass('loading');
      this.icon.addClass('open');
    }
  }

  componentDidMount() {
    this.icon = new DOMManipulator(this.refs.icon.getDOMNode());
    this.icon.addEvent('mouseover', this.mouseover);
    this.icon.addEvent('mouseout', this.mouseout);
    this.icon.addEvent('click', this.click);
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
