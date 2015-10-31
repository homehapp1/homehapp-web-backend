import React from 'react';

let debug = require('debug')('GoogleAnalytics');

export default class GoogleAnalytics extends React.Component {
  static propTypes = {
    router: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    debug('componentDidMount');
  }

  render() {
    return null;
  }
}
