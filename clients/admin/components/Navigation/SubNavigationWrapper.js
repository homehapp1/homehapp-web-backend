import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import SubNavigation from './SubNavigation';

class SubNavigationWrapper extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object,
      React.PropTypes.null
    ])
  };
  render() {
    return (
      <Row>
        <SubNavigation>
          {this.props.children[0]}
        </SubNavigation>
        <Col sm={9} smOffset={3} md={10} mdOffset={2} className='main'>
          {this.props.children[1]}
        </Col>
      </Row>
    );
  }
}

export default SubNavigationWrapper;
