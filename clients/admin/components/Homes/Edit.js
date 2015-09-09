/*global window */
'use strict';

import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import TabbedArea from 'react-bootstrap/lib/TabbedArea';
import TabPane from 'react-bootstrap/lib/TabPane';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';
import EditDetails from './EditDetails';
import EditStory from './EditStory';

class HomesEdit extends React.Component {
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
          <h2 className='navigation-title'>Edit Home</h2>
          <NavItemLink to='homes'>
            &lt; Back
          </NavItemLink>
        </Nav>
        <Row>
          <h1>Edit {this.props.home.homeTitle}</h1>
          <TabbedArea defaultActiveKey={2}>
            <TabPane eventKey={1} tab='Details'>
              <EditDetails home={this.props.home} />
            </TabPane>
            <TabPane eventKey={2} tab='Story'>
              <EditStory home={this.props.home} />
            </TabPane>
          </TabbedArea>
        </Row>
      </SubNavigationWrapper>
    );
  }
}

export default HomesEdit;
