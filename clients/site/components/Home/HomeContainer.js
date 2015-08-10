'use strict';

import React from 'react';
import HomeStore from '../../stores/HomeStore';
import HomeStory from './Story';

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
      <div className='story-loader'>
        <h3>Loading story data...</h3>
      </div>
    );
  }

  handleErrorState() {
    return (
      <div className='story-error'>
        <h3>Error loading story!</h3>
        <p>{this.state.error.message}</p>
      </div>
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
