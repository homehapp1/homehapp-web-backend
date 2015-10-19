

import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';

import { setPageTitle } from '../../../common/Helpers';
// import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';

class HomesIndex extends React.Component {
  static propTypes = {
    homes: React.PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setPageTitle('Homes');
  }

  render() {
    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>
            Homes
          </h2>
          <p>There are {this.props.homes.length} homes in the system currently.</p>
          <ul>
            <li><Link to='homeCreate'><i className='fa fa-home'></i> Create a new home</Link></li>
          </ul>
        </Nav>
        <Row>
          <h1><i className='fa fa-home'></i> {this.props.homes.length} homes</h1>
          <ul>
            {this.props.homes.map((home, i) => {
              return (
                <li key={i}>
                  <Link
                    to='homeEdit'
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
