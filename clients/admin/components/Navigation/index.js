import React from 'react';
import { Link } from 'react-router';

import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
// import NavItem from 'react-bootstrap/lib/NavItem';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import CollapsibleNav from 'react-bootstrap/lib/CollapsibleNav';

import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';
import MenuItemLink from 'react-router-bootstrap/lib/MenuItemLink';

class Navigation extends React.Component {
  static propTypes = {
    user: React.PropTypes.object
  }

  render() {
    let userName = '';
    if (this.props.user && this.props.user.displayName) {
      userName = this.props.user.displayName;
    }
    return (
      <Navbar brand={<Link to='app'>Homehapp Admin</Link>} inverse fixedTop fluid toggleNavKey={0}>
        <CollapsibleNav eventKey={0}>
          <Nav navbar>
            <NavItemLink eventKey={1} to='homes'>Homes</NavItemLink>
            <NavItemLink eventKey={2} to='neighborhoods'>Neighborhoods</NavItemLink>
            <NavItemLink eventKey={3} to='pages'>Content pages</NavItemLink>
            <NavItemLink eventKey={4} to='agents'>Agents</NavItemLink>
            <NavItemLink eventKey={5} to='contacts'>Contact requests</NavItemLink>
            <NavItemLink eventKey={6} to='users'>Users</NavItemLink>
          </Nav>
          <Nav navbar right>
            <DropdownButton eventKey={1} title={userName}>
              <MenuItemLink eventKey='1' to='app'>Profile</MenuItemLink>
              <MenuItem divider />
              <MenuItem eventKey='2' href='/auth/logout'>Logout</MenuItem>
            </DropdownButton>
          </Nav>
        </CollapsibleNav>
      </Navbar>
    );
  }
}

export default Navigation;
