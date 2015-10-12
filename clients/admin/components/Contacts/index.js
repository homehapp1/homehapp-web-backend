'use strict';

import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
// import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';

class ContactsIndex extends React.Component {
  static propTypes = {
    contacts: React.PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className="navigation-title">
            Contacts
          </h2>
          <p>There are {this.props.contacts.length} contacts in the system currently.</p>
        </Nav>
        <Row>
          <h1><i className='fa fa-contact'></i> {this.props.contacts.length} contacts</h1>

          <ul>
            {this.props.contacts.map((contact, i) => {
              return (
                <li key={i}>
                  <Link
                    to="contactEdit"
                    params={{id: contact.id}}>
                    {contact.contactTitle}
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

export default ContactsIndex;
