

import React from 'react';

export default class ContentNavigation extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ])
  };

  render() {
    return (
      <div id='contentNavigation'>
        {this.props.children}
      </div>
    );
  }
}
