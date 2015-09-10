'use strict';

import React from 'react';
import Icon from './Icon';

export default class Separator extends React.Component {
  static propTypes = {
    icon: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ])
  };

  static defaultProps = {
    icon: null
  };

  render() {
    let icon = null;

    if (this.props.icon) {
      icon = (<Icon type={this.props.icon} />);
    }

    return (
      <div className='separator widget pattern'>
        {icon}
        {this.props.children}
      </div>
    );
  }
}
