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
import EditModel from '../Shared/EditModel';
import ViewMetadata from '../Shared/ViewMetadata';

// let debug = require('debug')('UsersEdit');

export default class UsersEdit extends EditModel {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
    tab: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ])
  }

  constructor(props) {
    super(props);
  }

  render() {
    let openTab = this.resolveOpenTab();
    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>Edit User</h2>
          <NavItemLink to='users'>
            &lt; Back
          </NavItemLink>
        </Nav>
        <Row>
          <h1><i className='fa fa-user'></i> Edit {this.props.user.displayName}</h1>
          <TabbedArea defaultActiveKey={openTab}>
            <TabPane eventKey={1} tab='Details'>
              <EditDetails user={this.props.user} />
            </TabPane>
            <TabPane eventKey={3} tab='Metadata'>
              <ViewMetadata object={this.props.user} />
            </TabPane>
          </TabbedArea>
        </Row>
      </SubNavigationWrapper>
    );
  }
}
