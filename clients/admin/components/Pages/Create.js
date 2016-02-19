/*global window */
import React from 'react';
// import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import TabbedArea from 'react-bootstrap/lib/TabbedArea';
import TabPane from 'react-bootstrap/lib/TabPane';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';
import PagesDetails from './Details';

import { setPageTitle } from '../../../common/Helpers';

export default class PagesCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setPageTitle(['Create', 'Pages']);
  }

  render() {
    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>Create a new page</h2>
          <NavItemLink to='pages'>
            &lt; Back
          </NavItemLink>
        </Nav>
        <Row>
          <h1><i className='fa fa-page'></i> Create a new page</h1>
          <TabbedArea defaultActiveKey={1}>
            <TabPane eventKey={1} tab='Details'>
              <PagesDetails />
            </TabPane>
          </TabbedArea>
        </Row>
      </SubNavigationWrapper>
    );
  }
}
