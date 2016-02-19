import React from 'react';
import UserListStore from '../../stores/UserListStore';
import UsersIndex from './index';

import Loading from '../../../common/components/Widgets/Loading';

let debug = require('../../../common/debugger')('UsersIndexContainer');

class UsersIndexContainer extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    users: UserListStore.getState().users
  }

  componentDidMount() {
    debug('componentDidMount');
    UserListStore.listen(this.storeListener);
    UserListStore.fetchUsers();
  }

  componentWillUnmount() {
    UserListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    debug('onChange', state);
    this.setState({
      users: UserListStore.getState().users
    });
  }

  handlePendingState() {
    return (
      <Loading>
        <h3>Loading users...</h3>
      </Loading>
    );
  }

  handleErrorState() {
    return (
      <div className='users-error'>
        <h3>Error loading users!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }
    if (UserListStore.isLoading() || !this.state.users) {
      return this.handlePendingState();
    }

    return (
      <UsersIndex users={this.state.users} />
    );
  }
}

export default UsersIndexContainer;
