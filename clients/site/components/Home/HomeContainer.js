'use strict';

import React from 'react';
import HomeStore from '../../stores/HomeStore';
import HomeStory from './Story';

import Loading from '../../../common/components/Widgets/Loading';
import ErrorPage from '../../../common/components/Layout/ErrorPage';

class HomeContainer extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.homeStoreListener = this.homeStoreOnChange.bind(this);
  }

  componentDidMount() {
    HomeStore.listen(this.homeStoreListener);
    HomeStore.fetchHomeBySlug(this.props.params.slug);
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.homeStoreListener);
  }

  state = {
    error: null,
    home: HomeStore.getState().home
  }

  homeStoreOnChange(state) {
    this.setState(state);
  }

  handlePendingState() {
    return (
      <Loading>
        <p>Loading story data</p>
      </Loading>
    );
  }

  handleErrorState() {
    let error = {
      title: 'Error loading story!',
      message: this.state.error.message
    };

    return (
      <ErrorPage {...error} />
    );
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }
    if (HomeStore.isLoading() || !this.state.home) {
      return this.handlePendingState();
    }

    return (
      <HomeStory home={this.state.home} />
    );
  }
}

export default HomeContainer;
