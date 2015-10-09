'use strict';

import React from 'react';

let debug = require('debug')('NotificationLayout');

export default class NotificationLayout extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ])
  }
  render() {
    return (
      <div id='notificationLayout'>
        <div className='mask'></div>
        <div className='content'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
