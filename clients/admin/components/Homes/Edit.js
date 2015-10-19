/*global window */


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
import EditModel from '../Shared/EditModel';
import ChooseAgents from './ChooseAgents';
import ViewMetadata from '../Shared/ViewMetadata';

// let debug = require('debug')('HomesEdit');

export default class HomesEdit extends EditModel {
  static propTypes = {
    home: React.PropTypes.object.isRequired,
    tab: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ])
  }

  constructor(props) {
    super(props);
    this.tabs.agents = 4;
  }

  render() {
    let openTab = this.resolveOpenTab();
    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>Edit Home</h2>
          <NavItemLink to='homes'>
            &lt; Back
          </NavItemLink>
        </Nav>
        <Row>
          <h1><i className='fa fa-home'></i> Edit {this.props.home.homeTitle}</h1>
          <TabbedArea defaultActiveKey={openTab}>
            <TabPane eventKey={1} tab='Details'>
              <EditDetails home={this.props.home} />
            </TabPane>
            <TabPane eventKey={2} tab='Story'>
              <EditStory home={this.props.home} />
            </TabPane>
            <TabPane eventKey={3} tab='Metadata'>
              <ViewMetadata object={this.props.home} />
            </TabPane>
            <TabPane eventKey={4} tab='Agents'>
              <ChooseAgents home={this.props.home} />
            </TabPane>
          </TabbedArea>
        </Row>
      </SubNavigationWrapper>
    );
  }
}
