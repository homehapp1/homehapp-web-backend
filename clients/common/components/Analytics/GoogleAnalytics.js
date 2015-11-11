/* global ga, window */
import React from 'react';

let debug = require('debug')('GoogleAnalytics');

export default class GoogleAnalytics extends React.Component {
  constructor() {
    super();
    this.init = false;
  }

  componentDidMount() {
    debug('componentDidMount');
  }

  // shouldComponentUpdate() {
  //   debug('shouldComponentUpdate');
  //   return false;
  // }

  render() {
    if (typeof ga !== 'undefined' && typeof window !== 'undefined') {
      ga('send', 'pageview', window.location.pathname);
    }
    return null;
  }
}
