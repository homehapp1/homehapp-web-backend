/* global window */

import React from 'react';
import { scrollTop, setFullHeight, itemViews } from '../../Helpers';
import ApplicationStore from '../../stores/ApplicationStore';

let debug = require('debug')('Layout');

export default class Layout extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object,
      React.PropTypes.null
    ]).isRequired
  }

  static defaultProps = {
  }

  constructor() {
    super();
    this.pageScroller = this.pageScroller.bind(this);
    this.stateListener = this.onStateChange.bind(this);
  }

  state = {
    application: ApplicationStore.getState()
  }

  componentDidMount() {
    debug('ApplicationStore', this.state.application, ApplicationStore);
    window.addEventListener('resize', setFullHeight);
    window.addEventListener('scroll', itemViews);

    this.refs.scroller.getDOMNode().addEventListener('click', this.pageScroller, true);
    this.refs.scroller.getDOMNode().addEventListener('touchstart', this.pageScroller, true);

    ApplicationStore.listen(this.stateListener);

    if (!this.state.application) {
      ApplicationStore.getState();
    }

    // Trigger the events on load
    setFullHeight();
    itemViews();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', setFullHeight);
    window.removeEventListener('scroll', itemViews);
    this.refs.scroller.getDOMNode().removeEventListener('click', this.pageScroller);
    this.refs.scroller.getDOMNode().removeEventListener('touchstart', this.pageScroller);

    ApplicationStore.unlisten(this.stateListener);
  }

  onStateChange(state) {
    debug('got state', state);
    this.setState(state);
  }

  pageScroller() {
    let top = scrollTop() + window.innerHeight;
    scrollTop(top);
  }

  render() {
    return (
      <div id='layout'>
        <div id='modals'></div>
        {this.props.children}
        <i className='fa fa-angle-down' id='scrollDown' ref='scroller'></i>
      </div>
    );
  }
}
