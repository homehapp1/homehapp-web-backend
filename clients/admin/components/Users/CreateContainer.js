import React from 'react';
//import UserListStore from '../../stores/UserListStore';
import UserStore from '../../stores/UserStore';
import UsersCreate from './Create';
import Loading from '../../../common/components/Widgets/Loading';

export default class UsersCreateContainer extends React.Component {
  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    user: null
  }

  componentDidMount() {
    UserStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    UserStore.unlisten(this.storeListener);
  }

  onChange(/*state*/) {
    this.setState({
      error: UserStore.getState().error,
      user: UserStore.getState().user
    });
  }

  handlePendingState() {
    return (
      <Loading>
        <h3>Creating a new user...</h3>
      </Loading>
    );
  }

  handleErrorState() {
    return (
      <div className='users-error'>
        <h3>Error creating a new user!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }

    if (UserStore.isLoading()) {
      return this.handlePendingState();
    }

    return (
      <UsersCreate user={this.state.user} />
    );
  }
}
