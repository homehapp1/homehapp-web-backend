'use strict';

import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
// import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';

class HomesIndex extends React.Component {
  static propTypes = {
    homes: React.PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className="navigation-title">
            Homes ({this.props.homes.length})
          </h2>
        </Nav>
        <Row>
          <h1>{this.props.homes.length} homes</h1>

          <ul>
            {this.props.homes.map((home, i) => {
              return (
                <li key={i}>
                  <Link
                    to="homeEdit"
                    params={{id: home.id}}>
                    {home.homeTitle}
                  </Link>
                </li>
              );
            })}
          </ul>

        </Row>
      </SubNavigationWrapper>
    );
  }
}

export default HomesIndex;
