'use strict';

import React from 'react';
import ContactListStore from '../../stores/ContactListStore';
import ContactsEdit from './Edit';
import Loading from '../../../common/components/Widgets/Loading';
let debug = require('debug')('EditContainer');

export default class ContactsEditContainer extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    contact: ContactListStore.getContact(this.props.params.id)
  }

  componentDidMount() {
    ContactListStore.listen(this.storeListener);
    if (!ContactListStore.getContact(this.props.params.id)) {
      ContactListStore.fetchContacts();
    }
  }

  componentWillUnmount() {
    ContactListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    debug('state', state, ContactListStore.getState());
    this.setState({
      error: ContactListStore.getState().error,
      contact: ContactListStore.getContact(this.props.params.id)
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
    debug('Contact', this.state.contact);

    if (ContactListStore.isLoading() || !this.state.contact) {
      return this.handlePendingState();
    }

    let tab = this.props.params.tab || 1;

    return (
      <ContactsEdit contact={this.state.contact} tab={tab} />
    );
  }
}
