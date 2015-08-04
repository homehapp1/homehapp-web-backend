'use strict';

import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class HomesEditStory extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row>
        <Col>
          <h1>Story view</h1>
        </Col>
      </Row>
    );
  }
}

export default HomesEditStory;
