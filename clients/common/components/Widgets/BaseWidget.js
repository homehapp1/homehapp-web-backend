import React from 'react';
let debug = require('debug')('BaseWidget');

export default class BaseWidget extends React.Component {
  static validate(props) {
    debug('Default validate used, overriding is mandatory');
    return false;
  }

  renderWidget() {
    debug('Default render widget, please override');
    return null;
  }

  render() {
    try {
      if (typeof this.constructor.validate !== 'function') {
        debug('Validate method missing', this);
      } else {
        this.constructor.validate(this.props);
      }
    } catch (err) {
      debug('Validation failed', this.props, err.message);
      return null;
    }

    return this.renderWidget();
  }
}
