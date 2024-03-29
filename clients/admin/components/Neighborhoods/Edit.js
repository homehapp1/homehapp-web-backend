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
import EditArea from './EditArea';
import EditStory from './EditStory';
import EditModel from '../Shared/EditModel';
import ViewMetadata from '../Shared/ViewMetadata';
import NeighborhoodStore from '../../stores/NeighborhoodStore';
import NeighborhoodActions from '../../actions/NeighborhoodActions';

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

  refreshTab(tab) {
    debug('refreshTab', arguments);
    this.setState({tab: tab});
    if (tab === 4 && this.refs.areaSelector && typeof this.refs.areaSelector.updateMap === 'function') {
      this.refs.areaSelector.updateMap();
    }
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
          <TabbedArea defaultActiveKey={openTab} onSelect={this.refreshTab.bind(this)} activeKey={openTab}>
            <TabPane eventKey={1} tab='Details'>
              <EditDetails neighborhood={this.props.neighborhood} />
            </TabPane>
            <TabPane eventKey={2} tab='Story'>
              <EditStory neighborhood={this.props.neighborhood} />
            </TabPane>
            <TabPane eventKey={4} tab='Area'>
              <EditArea neighborhood={this.props.neighborhood} ref='areaSelector' />
            </TabPane>
            <TabPane eventKey={3} tab='Metadata'>
              <ViewMetadata object={this.props.neighborhood} store={NeighborhoodStore} actions={NeighborhoodActions} />
            </TabPane>
          </TabbedArea>
        </Row>
      </SubNavigationWrapper>
    );
  }
}
