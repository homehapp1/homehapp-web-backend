import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import Table from 'react-bootstrap/lib/Table';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
// import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';
import TimeAgo from '../../../common/components/TimeAgo';
import Loading from '../../../common/components/Widgets/Loading';

import ContactListStore from '../../stores/ContactListStore';
import ContactsIndex from './index';

import { setPageTitle } from '../../../common/Helpers';

let debug = require('debug')('ContactsIndex');

export default class Contacts extends React.Component {
  static propTypes = {
    contacts: React.PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    contacts: ContactListStore.getState().contacts
  }

  componentDidMount() {
    setPageTitle('Contact requests');
    ContactListStore.listen(this.storeListener);
    ContactListStore.fetchContacts();
  }

  componentWillUnmount() {
    ContactListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    debug('onChange', state);
    this.setState({
      contacts: ContactListStore.getState().contacts
    });
  }

  handlePendingState() {
    return (
      <Loading>
        <h3>Loading contacts...</h3>
      </Loading>
    );
  }

  handleErrorState() {
    return (
      <div className='contacts-error'>
        <h3>Error loading contacts!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }

    if (ContactListStore.isLoading() || !this.state.contacts) {
      return this.handlePendingState();
    }

    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>
            Contacts
          </h2>
          <p>There are {this.state.contacts.length} contacts in the system currently.</p>
        </Nav>
        <Row>
          <h1><i className='fa fa-contact'></i> {this.state.contacts.length} contacts</h1>
          <Table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Home</th>
                <th>Contact type</th>
                <th>Contact subtype</th>
                <th>Sender</th>
                <th>Recipient</th>
              </tr>
            </thead>
            <tbody>
              {this.state.contacts.map((contact, i) => {
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
                    <td>{contact.subType}</td>
                    <td>{sender} {senderEmail}</td>
                    <td>{recipient} {recipientEmail}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Row>
      </SubNavigationWrapper>
    );
  }
}
