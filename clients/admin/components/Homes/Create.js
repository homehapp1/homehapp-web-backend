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
import CreateDetails from './CreateDetails';

export default class HomesCreate extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>Create a new Home</h2>
          <NavItemLink to='homes'>
            &lt; Back
          </NavItemLink>
        </Nav>
        <Row>
          <h1><i className='fa fa-home'></i> Create a new home</h1>
          <TabbedArea defaultActiveKey={1}>
            <TabPane eventKey={1} tab='Details'>
              <CreateDetails home={this.props.home} />
            </TabPane>
          </TabbedArea>
        </Row>
      </SubNavigationWrapper>
    );
  }
}
