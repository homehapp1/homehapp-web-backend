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

class NeighborhoodsEdit extends React.Component {
  static propTypes = {
    neighborhood: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>Edit Neighborhood</h2>
          <NavItemLink to='neighborhoods'>
            &lt; Back
          </NavItemLink>
        </Nav>
        <Row>
          <h1>Edit {this.props.neighborhood.neighborhoodTitle}</h1>
          <TabbedArea defaultActiveKey={1}>
            <TabPane eventKey={1} tab='Details'>
              <EditDetails neighborhood={this.props.neighborhood} />
            </TabPane>
            <TabPane eventKey={2} tab='Story'>
              <EditStory neighborhood={this.props.neighborhood} />
            </TabPane>
          </TabbedArea>
        </Row>
      </SubNavigationWrapper>
    );
  }
}

export default NeighborhoodsEdit;
