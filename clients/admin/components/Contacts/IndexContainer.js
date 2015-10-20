import React from 'react';
import ContactListStore from '../../stores/ContactListStore';
import ContactsIndex from './index';

import Loading from '../../../common/components/Widgets/Loading';

let debug = require('../../../common/debugger')('ContactsIndexContainer');

class ContactsIndexContainer extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
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
    debug('componentDidMount');
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
      <ContactsIndex contacts={this.state.contacts} />
    );
  }
}

export default ContactsIndexContainer;
