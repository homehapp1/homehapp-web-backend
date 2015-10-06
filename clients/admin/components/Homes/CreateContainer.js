'use strict';

import React from 'react';
//import HomeListStore from '../../stores/HomeListStore';
import HomeStore from '../../stores/HomeStore';
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
    home: null //HomeListStore.getHome(blankId)
  }

  componentDidMount() {
    HomeStore.listen(this.storeListener);
    // if (!HomeListStore.getHome(blankId)) {
    //   HomeListStore.fetchHomes();
    // }
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.storeListener);
  }

  onChange(/*state*/) {
    this.setState({
      error: HomeStore.getState().error,
      home: HomeStore.getState().home //HomeListStore.getHome(blankId)
    });
  }

  handlePendingState() {
    return (
      <Loading>
        <h3>Creating a new home...</h3>
      </Loading>
    );
  }

  handleErrorState() {
    return (
      <div className='homes-error'>
        <h3>Error creating a new home!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }

    if (HomeStore.isLoading()) {
      return this.handlePendingState();
    }

    return (
      <HomesCreate home={this.state.home} />
    );
  }
}
