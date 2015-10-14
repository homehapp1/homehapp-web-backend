'use strict';

import React from 'react';
import Icon from './Icon';

export default class Separator extends React.Component {
  static propTypes = {
    icon: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]),
    type: React.PropTypes.string,
    className: React.PropTypes.string
  };

  static defaultProps = {
    icon: null,
    type: 'pattern',
    className: null
  };

  render() {
    let icon = null;

    if (this.props.icon) {
      icon = (<Icon type={this.props.icon} />);
    }
    let classes = ['separator', 'widget', this.props.type];
    if (this.props.className) {
      classes.push(this.props.className);
    }

    return (
      <div className={classes.join(' ')}>
        {icon}
        {this.props.children}
      </div>
    );
  }
}
