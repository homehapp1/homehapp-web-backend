'use strict';

import React from 'react';
import HomeListStore from '../../stores/HomeListStore';
import HomesEdit from './Edit';

class HomesEditContainer extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  componentDidMount() {
    HomeListStore.listen(this.storeListener);
    if (!HomeListStore.getHome(this.props.params.id)) {
      HomeListStore.fetchHomes();
    }
  }

  componentWillUnmount() {
    HomeListStore.unlisten(this.storeListener);
  }

  state = {
    error: null,
    home: HomeListStore.getHome(this.props.params.id)
  }

  onChange(state) {
    console.log('onChange', state);
    this.setState({
      error: HomeListStore.getState().error,
      home: HomeListStore.getHome(this.props.params.id)
    });
  }

  handlePendingState() {
    return (
      <div className='homes-loader'>
        <h3>Loading homes...</h3>
      </div>
    );
  }

  handleErrorState() {
    return (
      <div className='homes-error'>
        <h3>Error loading homes!</h3>
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
      <HomesEdit home={this.state.home} />
    );
  }
}

export default HomesEditContainer;
