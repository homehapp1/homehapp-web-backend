'use strict';

import React from 'react';
import Col from 'react-bootstrap/lib/Col';

class SubNavigation extends React.Component {
  render() {
    return (
      <Col sm={3} md={2} className='sidebar'>
        {this.props.children}
      </Col>
    );
  }
}

export default SubNavigation;
