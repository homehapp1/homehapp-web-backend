'use strict';

import React from 'react';
import Icon from './Icon';

class Separator extends React.Component {
  static propTypes = {
    icon: React.PropTypes.string
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
      </div>
    );
  }
}

export default Separator;
