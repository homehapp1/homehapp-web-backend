'use strict';

import React from 'react';
import Alert from 'react-bootstrap/lib/Alert';
import { merge } from '../../../common/Helpers';

let debug = require('../../../common/debugger')('Notification');


export default class Notification {
  constructor(data) {
    this.closeNotification = this.closeNotification.bind(this);
    this.notifications.push(this.create(data));
  }

  notifications = [];

  closeNotification() {
    if (this.node && this.node.parentNode) {
      this.node.parentNode.removeChild(this.node);
    }
  }

  create(data) {
    let defaults = {
      type: 'info',
      message: '',
      duration: 5
    };

    let notification = merge(defaults, data);
    let props = {
      dismissAfter: notification.duration,
      closeLabel: 'X'
    };
    debug('props', props);

    let classes = [
      'notification',
      `alert-${data.type}`
    ];

    this.alert = (
      <Alert className={classes.join(' ')}>
        {notification.message}
        <span className='close' onClick={this.closeNotification}>×</span>
      </Alert>
    );
    let app = this;
    React.render(this.alert, document.getElementById('notifications'), function notificationCallback() {
      app.node = React.findDOMNode(this);
      if (notification.duration) {
        setTimeout(app.closeNotification, notification.duration * 1000);
      }
    });
    return this.alert;
  }
}
