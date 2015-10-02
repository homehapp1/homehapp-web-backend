'use strict';

import React from 'react';
// import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
// import Table from 'react-bootstrap/lib/Table';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import HomeStore from '../../stores/HomeStore';
// import HomeActions from '../../actions/HomeActions';
import StoryEditBlocks from './StoryEditBlocks';

let debug = require('../../../common/debugger')('HomesEditStory');

export default class HomesCreateStory extends React.Component {
  render() {
    return (
      <Row>
        <form name='homeStory' ref='homeStoryForm' method='POST'>
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
