

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
          <h2>Frontpage</h2>
          <NavItemLink to='homes'>Homes</NavItemLink>
          <NavItemLink to='neighborhoods'>Neighborhoods</NavItemLink>
          <NavItemLink to='agents'>Agents</NavItemLink>
          <NavItemLink to='contacts'>Contact requests</NavItemLink>
          <NavItemLink to='users'>Users</NavItemLink>
        </Nav>
        <Row>
          <h1>Welcome to admin!</h1>
        </Row>
      </SubNavigationWrapper>
    );
  }
}

export default Homepage;
