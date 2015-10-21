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
import ViewMetadata from '../Shared/ViewMetadata';

import { setPageTitle } from '../../../common/Helpers';

let debug = require('debug')('NeighborhoodsEdit');

export default class NeighborhoodsEdit extends EditModel {
  static propTypes = {
    neighborhood: React.PropTypes.object.isRequired,
    tab: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ])
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setPageTitle([`Edit ${this.props.neighborhood.title}`, 'Neighborhoods']);
  }

  render() {
    let openTab = this.resolveOpenTab();
    debug('openTab', openTab);
    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>Edit Neighborhood</h2>
          <NavItemLink to='neighborhoods'>
            &lt; Back
          </NavItemLink>
        </Nav>
        <Row>
          <h1>Edit {this.props.neighborhood.title}</h1>
          <TabbedArea defaultActiveKey={openTab}>
            <TabPane eventKey={1} tab='Details'>
              <EditDetails neighborhood={this.props.neighborhood} />
            </TabPane>
            <TabPane eventKey={2} tab='Story'>
              <EditStory neighborhood={this.props.neighborhood} />
            </TabPane>
            <TabPane eventKey={3} tab='Metadata'>
              <ViewMetadata object={this.props.neighborhood} />
            </TabPane>
          </TabbedArea>
        </Row>
      </SubNavigationWrapper>
    );
  }
}
