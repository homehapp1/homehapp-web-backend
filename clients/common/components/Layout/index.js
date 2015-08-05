/* global window */
'use strict';

import React from 'react';
import { windowScroller} from '../../Helpers';

class Layout extends React.Component {
  static propTypes = {
    children: React.PropTypes.array.isRequired,
    width: React.PropTypes.number
  }

  static defaultProps = {
  }

  constructor() {
    super();
    this.scrollTop = this.scrollTop.bind(this);
    this.pageScroller = this.pageScroller.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.scrollTop);
    window.addEventListener('resize', this.resize);

    this.refs.scroller.getDOMNode().addEventListener('click', this.pageScroller, true);
    this.refs.scroller.getDOMNode().addEventListener('touchstart', this.pageScroller, true);

    // Trigger the events on load
    this.scrollTop();
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollTop);
    window.removeEventListener('resize', this.resize);
    this.refs.scroller.getDOMNode().removeEventListener('click', this.pageScroller);
    this.refs.scroller.getDOMNode().removeEventListener('touchstart', this.pageScroller);
  }

  // Get the scroll top
  getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  // Generic stuff that should happen on scrollTop
  scrollTop() {
    let top = this.getScrollTop();
    let header = document.getElementById('header');

    if (top < this.scrollTop) {
      header.className = header.className.replace(/ ?away/, '');
    } else if (!header.className.match(/away/)) {
      header.className += ' away';
    }

    this.scrollTop = top;
  }

  pageScroller() {
    let top = this.getScrollTop();

    top += window.innerHeight;
    windowScroller(top);
  }

  // Generic stuff that should happen when the window is resized
  resize(e) {
    let items = document.getElementsByClassName('full-height');
    let height = window.innerHeight;

    for (let i = 0; i < items.length; i++) {
      items[i].style.minHeight = `${height}px`;
    }
  }

  render() {
    let style = {
      //width: `${this.props.width}px`
    };
    return (
      <div id='layout' style={style}>
        {this.props.children}
        <i className='fa fa-angle-down' id='scrollDown' ref='scroller'></i>
      </div>
    );
  }
}

export default Layout;
