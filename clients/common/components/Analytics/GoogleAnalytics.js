'use strict';

import React from 'react';

let debug = require('debug')('GoogleAnalytics');

export default class GoogleAnalytics extends React.Component {
  propTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentDidMount() {
    debug('componentDidMount');
  }

  render() {
    debug(this.props.router);
    return null;
  }
}
