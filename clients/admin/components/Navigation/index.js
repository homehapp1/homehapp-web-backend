"use strict";

import React from "react";
import { Link } from "react-router";

import Navbar from "react-bootstrap/lib/Navbar";
import Nav from "react-bootstrap/lib/Nav";
import NavItem from "react-bootstrap/lib/NavItem";
import CollapsibleNav from "react-bootstrap/lib/CollapsibleNav";

import NavItemLink from "react-router-bootstrap/lib/NavItemLink";

class Navigation extends React.Component {
  render() {
    return (
      <Navbar brand={<Link to="app">Homehapp Admin</Link>} inverse fixedTop fluid toggleNavKey={0}>
        <CollapsibleNav eventKey={0}>
          <Nav navbar>
            <NavItemLink eventKey={1} to="app">Link</NavItemLink>
          </Nav>
          <Nav navbar right>
            <NavItem eventKey={1} href='/auth/logout'>Logout</NavItem>
          </Nav>
        </CollapsibleNav>
      </Navbar>
    );
  }
}

export default Navigation;
