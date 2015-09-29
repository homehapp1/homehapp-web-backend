'use strict';

import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';

export default class NeighborhoodsIndex extends React.Component {
  static propTypes = {
    neighborhoods: React.PropTypes.array
  }
  static defaultProps = {
    neighborhoods: []
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <NavItemLink to='app'>Frontpage</NavItemLink>
          <h2 className="navigation-title">
            @TODO: Neighborhoods
          </h2>
        </Nav>
        <Row>
          <h1>{this.props.neighborhoods.length} neighborhoods</h1>

          <ul>
            {this.props.neighborhoods.map((neighborhood, i) => {
              return (
                <li key={i}>
                  <Link
                    to="neighborhoodEdit"
                    params={{id: neighborhood.id}}>
                    {neighborhood.title}
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
