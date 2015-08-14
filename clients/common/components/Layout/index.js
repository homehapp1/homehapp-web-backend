/* global window */
'use strict';

import React from 'react';
import { scrollTop, setFullHeight } from '../../Helpers';

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

    this.refs.scroller.getDOMNode().addEventListener('click', this.pageScroller, true);
    this.refs.scroller.getDOMNode().addEventListener('touchstart', this.pageScroller, true);

    // Trigger the events on load
    setFullHeight();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', setFullHeight);
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
