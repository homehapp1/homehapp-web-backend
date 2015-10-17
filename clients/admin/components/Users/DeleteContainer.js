

import React from 'react';
import UserListStore from '../../stores/UserListStore';
import UsersDelete from './Delete';
import Loading from '../../../common/components/Widgets/Loading';
let debug = require('debug')('DeleteContainer');

export default class UsersDeleteContainer extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    user: UserListStore.getUser(this.props.params.id)
  }

  componentDidMount() {
    UserListStore.listen(this.storeListener);
    if (!UserListStore.getUser(this.props.params.id)) {
      UserListStore.fetchUsers();
    }
  }

  componentWillUnmount() {
    UserListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    debug('state', state, UserListStore.getState());
    this.setState({
      error: UserListStore.getState().error,
      user: UserListStore.getUser(this.props.params.id)
    });
  }

  handlePendingState() {
    return (
      <Loading>
        <h3>Loading user...</h3>
      </Loading>
    );
  }

  handleErrorState() {
    return (
      <div className='users-error'>
        <h3>Error loading user!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }
    debug('User', this.state.user);

    if (UserListStore.isLoading() || !this.state.user) {
      return this.handlePendingState();
    }

    return (
      <UsersDelete user={this.state.user} />
    );
  }
}
