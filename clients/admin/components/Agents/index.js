'use strict';

import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';
import TabbedArea from 'react-bootstrap/lib/TabbedArea';
import TabPane from 'react-bootstrap/lib/TabPane';
import List from './List';
import CreateEdit from './CreateEdit';

class AgentsIndex extends React.Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className="navigation-title">
            Agents
          </h2>
          <p>There are {this.props.items.length} agents in the system currently.</p>
        </Nav>
        <Row>
          <TabbedArea defaultActiveKey={1}>
            <TabPane eventKey={1} tab='Current Agents'>
              <List items={this.props.items} />
            </TabPane>
            <TabPane eventKey={2} tab='Add new'>
              <CreateEdit />
            </TabPane>
          </TabbedArea>
        </Row>
      </SubNavigationWrapper>
    );
  }
}

export default AgentsIndex;
