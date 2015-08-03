'use strict';

import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';

class Homepage extends React.Component {
  render() {
    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <NavItemLink to='app'>Frontpage</NavItemLink>
        </Nav>
        <Row>
          <h1>Welcome to admin!</h1>
        </Row>
      </SubNavigationWrapper>
    );
  }
}

export default Homepage;
