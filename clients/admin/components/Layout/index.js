'use strict';

import React from 'react';

class Layout extends React.Component {
  static propTypes = {
    children: React.PropTypes.object.isRequired
  }

  render() {
    return (
      <div className='container-fluid'>
        {this.props.children}
      </div>
    );
  }
}

export default Layout;
