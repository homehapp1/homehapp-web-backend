'use strict';

import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';

// let debug = require('../../../common/debugger')('UsersEditStory');

export default class UsersCreateStory extends React.Component {
  render() {
    return (
      <Row>
        <form name='userStory' ref='userStoryForm' method='POST'>
          <Col md={10} sm={10}>
            <Panel header='Common'>
              <p>Please save the basic details first</p>
            </Panel>
          </Col>
        </form>
      </Row>
    );
  }
}
