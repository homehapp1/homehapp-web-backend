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
import ContactsViewDetails from './ViewDetails';
import EditModel from '../Shared/EditModel';
import ViewMetadata from '../Shared/ViewMetadata';

// let debug = require('debug')('ContactsEdit');

export default class ContactsEdit extends EditModel {
  static propTypes = {
    contact: React.PropTypes.object.isRequired,
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
          <h2 className='navigation-title'>View contact</h2>
          <NavItemLink to='contacts'>
            &lt; Back
          </NavItemLink>
        </Nav>
        <Row>
          <h1><i className='fa fa-contact'></i> Contact request {this.props.contact.contactTitle}</h1>
          <TabbedArea defaultActiveKey={openTab}>
            <TabPane eventKey={1} tab='Details'>
              <ContactsViewDetails contact={this.props.contact} />
            </TabPane>
            <TabPane eventKey={3} tab='Metadata'>
              <ViewMetadata object={this.props.contact} />
            </TabPane>
          </TabbedArea>
        </Row>
      </SubNavigationWrapper>
    );
  }
}
