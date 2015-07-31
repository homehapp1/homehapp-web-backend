'use strict';

import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Nav from 'react-bootstrap/lib/Nav';

import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';

class Homepage extends React.Component {
  render() {
    return (
      <Row>
        <Col sm={3} md={2} className='sidebar'>
          <Nav sidebar>
            <NavItemLink to='app'>Frontpage</NavItemLink>
          </Nav>
        </Col>
        <Col sm={9} smOffset={3} md={10} mdOffset={2} className='main'>
          <h1>Welcome to admin!</h1>
        </Col>
      </Row>
    );
  }
}

export default Homepage;
