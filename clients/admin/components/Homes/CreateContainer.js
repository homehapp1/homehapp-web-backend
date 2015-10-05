'use strict';

import React from 'react';
import HomeListStore from '../../stores/HomeListStore';
import HomesCreate from './Create';
import Loading from '../../../common/components/Widgets/Loading';
let blankId = null;

export default class HomesCreateContainer extends React.Component {
  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    home: HomeListStore.getHome(blankId)
  }

  componentDidMount() {
    HomeListStore.listen(this.storeListener);
    if (!HomeListStore.getHome(blankId)) {
      HomeListStore.fetchHomes();
    }
  }

  componentWillUnmount() {
    HomeListStore.unlisten(this.storeListener);
  }

  onChange(/*state*/) {
    this.setState({
      error: HomeListStore.getState().error,
      home: HomeListStore.getHome(blankId)
    });
  }

  handlePendingState() {
    return (
      <Loading>
        <h3>Creating a new home template...</h3>
      </Loading>
    );
  }

  handleErrorState() {
    return (
      <div className='homes-error'>
        <h3>Error creating a new home template!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }

    if (HomeListStore.isLoading() || !this.state.home) {
      return this.handlePendingState();
    }

    return (
      <HomesCreate home={this.state.home} />
    );
  }
}
