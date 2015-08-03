/* global window */
'use strict';

import React from 'react';

class Layout extends React.Component {
  static propTypes = {
    children: React.PropTypes.array.isRequired,
    width: React.PropTypes.number
  }
  static defaultProps = {
  }

  componentDidMount() {
    window.addEventListener('scroll', this.scrollTop);
    window.addEventListener('resize', this.resize);

    // Trigger the events on load
    this.scrollTop();
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollTop);
    window.removeEventListener('resize', this.resize);
  }

  // Get the scroll top
  getScrollTop() {
    let top = window.pageYOffset || document.documentElement.scrollTop;
    console.log('scrolltop', top);
    return top;
  }

  // Generic stuff that should happen on scrollTop
  scrollTop() {
    let top = this.getScrollTop();
    this.prevScroll = this.getScrollTop();
    console.log('top', top);
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
      </div>
    );
  }
}

export default Layout;
