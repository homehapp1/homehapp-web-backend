/*global window */
'use strict';

import React from 'react';
// import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import TabbedArea from 'react-bootstrap/lib/TabbedArea';
import TabPane from 'react-bootstrap/lib/TabPane';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';
import EditDetails from './EditDetails';
import EditStory from './EditStory';

export default class AgentsEdit extends React.Component {
  static propTypes = {
    agent: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>Edit Agent</h2>
          <NavItemLink to='agents'>
            &lt; Back
          </NavItemLink>
        </Nav>
        <Row>
          <h1><i className='fa fa-agent'></i> Edit {this.props.agent.agentTitle}</h1>
          <TabbedArea defaultActiveKey={1}>
            <TabPane eventKey={1} tab='Details'>
              <EditDetails agent={this.props.agent} />
            </TabPane>
            <TabPane eventKey={2} tab='Story'>
              <EditStory agent={this.props.agent} />
            </TabPane>
          </TabbedArea>
        </Row>
      </SubNavigationWrapper>
    );
  }
}
