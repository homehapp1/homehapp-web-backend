import React from 'react';
import Col from 'react-bootstrap/lib/Col';

class SubNavigation extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object,
      React.PropTypes.null
    ])
  };
  render() {
    return (
      <Col sm={3} md={2} className='sidebar'>
        {this.props.children}
      </Col>
    );
  }
}

export default SubNavigation;
