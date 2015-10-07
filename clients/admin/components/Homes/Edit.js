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

export default class HomesEdit extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired,
    tab: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ])
  }

  defaultProps = {
    tab: 1
  }

  constructor(props) {
    super(props);
  }

  render() {
    let openTab = Number(this.props.tab);
    if (isNaN(openTab)) {
      openTab = 1;
    }
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
          </TabbedArea>
        </Row>
      </SubNavigationWrapper>
    );
  }
}
