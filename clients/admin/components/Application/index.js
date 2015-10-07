'use strict';

import React from 'react';
let {RouteHandler} = require('react-router');

import Layout from '../Layout';
import Navigation from '../Navigation';
// import AuthActions from '../../../common/actions/AuthActions';
import AuthStore from '../../../common/stores/AuthStore';

import NeighborhoodListStore from '../../stores/NeighborhoodListStore';

export default class Application extends React.Component {
  static propTypes = {
  }
  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = AuthStore.getState();
    this.authStoreListener = this.onChange.bind(this);
    this.nhStoreListener = this.onChange.bind(this);
  }

  componentDidMount() {
    AuthStore.listen(this.authStoreListener);
    if (!AuthStore.getState().user) {
      AuthStore.fetchUser();
    }
    NeighborhoodListStore.fetchNeighborhoods();
  }

  componentWillUnmount() {
    AuthStore.unlisten(this.authStoreListener);
  }

  onChange() {
    this.setState({
      user: AuthStore.getState().user,
      neighborhoods: NeighborhoodListStore.getState().neighborhoods
    });
  }

  render() {
    return (
      <div>
        <Navigation user={this.state.user} />
        <Layout>
          <RouteHandler />
        </Layout>
      </div>
    );
  }
}
