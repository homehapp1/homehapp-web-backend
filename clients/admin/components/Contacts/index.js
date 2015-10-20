import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import Table from 'react-bootstrap/lib/Table';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
// import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';
import TimeAgo from '../../../common/components/TimeAgo';

import { setPageTitle } from '../../../common/Helpers';

let debug = require('debug')('ContactsIndex');

export default class ContactsIndex extends React.Component {
  static propTypes = {
    contacts: React.PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setPageTitle('Contact requests');
  }

  render() {
    debug('Render', this.props.contacts);
    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>
            Contacts
          </h2>
          <p>There are {this.props.contacts.length} contacts in the system currently.</p>
        </Nav>
        <Row>
          <h1><i className='fa fa-contact'></i> {this.props.contacts.length} contacts</h1>
          <Table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Home</th>
                <th>Contact type</th>
                <th>Sender</th>
                <th>Recipient</th>
              </tr>
            </thead>
            <tbody>
              {this.props.contacts.map((contact, i) => {
                let sender = null;
                let senderEmail = null;
                let home = null;
                let recipient = null;
                let recipientEmail = null;

                if (contact.sender.name) {
                  sender = contact.sender.name;
                }
                if (contact.sender.email) {
                  senderEmail = (
                    <a href={`mailto:${contact.sender.email}`}>
                      {`<${contact.sender.email}>`}
                    </a>
                  );
                }
                if (contact.recipient.name) {
                  recipient = contact.recipient.name;
                }
                if (contact.recipient.email) {
                  recipientEmail = (
                    <a href={`mailto:${contact.recipient.email}`}>
                      {`<${contact.recipient.email}>`}
                    </a>
                  );
                }

                if (contact.home) {
                  home = (
                    <Link to='homeEdit' params={{id: contact.home.id}}>
                      {contact.home.homeTitle}
                    </Link>
                  );
                }

                return (
                  <tr key={`contact${i}`}>
                    <td>
                      <Link to='contactView' params={{id: contact.id}}>
                        <TimeAgo date={contact.createdAt} />
                      </Link>
                    </td>
                    <td>{home}</td>
                    <td>{contact.type}</td>
                    <td>{sender} {senderEmail}</td>
                    <td>{recipient} {recipientEmail}</td>
                  </tr>
                );
                // let home = null;
                // let recipient = [];
                //
                // if (contact.recipient.name) {
                //   recipient.push(contact.recipient.name);
                // }
                // if (contact.recipient.email) {
                //   recipient.push(contact.recipient.email);
                // }
                //
                //
                // return (
                //   <tr key={`contact${i}`}>
                //     <td>{recipient.join(' ')}</td>
                //     <td>
                //       <Link
                //         to='contactView'
                //         params={{id: contact.id}}>
                //         {contact.contactTitle}
                //       </Link>
                //     </td>
                //     <td>{home}</td>
                //   </tr>
                // );
              })}
            </tbody>
          </Table>
        </Row>
      </SubNavigationWrapper>
    );
  }
}
