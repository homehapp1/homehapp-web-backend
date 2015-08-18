/* global window */
'use strict';

import React from 'react';
import { scrollTop, setFullHeight, itemViews } from '../../Helpers';

class Layout extends React.Component {
  static propTypes = {
    children: React.PropTypes.array.isRequired
  }

  static defaultProps = {
  }

  constructor() {
    super();
    this.pageScroller = this.pageScroller.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', setFullHeight);
    window.addEventListener('scroll', itemViews);

    this.refs.scroller.getDOMNode().addEventListener('click', this.pageScroller, true);
    this.refs.scroller.getDOMNode().addEventListener('touchstart', this.pageScroller, true);

    // Trigger the events on load
    setFullHeight();
    itemViews();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', setFullHeight);
    window.removeEventListener('scroll', itemViews);
    this.refs.scroller.getDOMNode().removeEventListener('click', this.pageScroller);
    this.refs.scroller.getDOMNode().removeEventListener('touchstart', this.pageScroller);
  }


  pageScroller() {
    let top = scrollTop() + window.innerHeight;
    scrollTop(top);
  }

  render() {
    return (
      <div id='layout'>
        {this.props.children}
        <i className='fa fa-angle-down' id='scrollDown' ref='scroller'></i>
      </div>
    );
  }
}

export default Layout;
