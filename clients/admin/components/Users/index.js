import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
// import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';

import { setPageTitle } from '../../../common/Helpers';

class UsersIndex extends React.Component {
  static propTypes = {
    users: React.PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setPageTitle('User management');
  }

  render() {
    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>
            Users
          </h2>
          <p>There are {this.props.users.length} users in the system currently.</p>
          <ul>
            <li><Link to='userCreate'><i className='fa fa-user'></i> Create a new user</Link></li>
          </ul>
        </Nav>
        <Row>
          <h1><i className='fa fa-user'></i> {this.props.users.length} users</h1>

          <ul>
            {this.props.users.map((user, i) => {
              return (
                <li key={i}>
                  <Link
                    to='userEdit'
                    params={{id: user.id}}>
                    {user.displayName}
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

export default UsersIndex;
