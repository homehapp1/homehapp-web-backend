'use strict';

import React from 'react';
import HomeListStore from '../../stores/HomeListStore';
import HomesIndex from './index';

import Loading from '../../../common/components/Widgets/Loading';

let debug = require('../../../common/debugger')('HomesIndexContainer');

class HomesIndexContainer extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  componentDidMount() {
    debug('componentDidMount');
    HomeListStore.listen(this.storeListener);
    HomeListStore.fetchHomes();
  }

  componentWillUnmount() {
    HomeListStore.unlisten(this.storeListener);
  }

  state = {
    error: null,
    homes: HomeListStore.getState().homes
  }

  onChange(state) {
    debug('onChange', state);
    this.setState({
      homes: HomeListStore.getState().homes
    });
  }

  handlePendingState() {
    return (
      <Loading>
        <h3>Loading homes...</h3>
      </Loading>
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
    if (HomeListStore.isLoading() || !this.state.homes) {
      return this.handlePendingState();
    }

    return (
      <HomesIndex homes={this.state.homes} />
    );
  }
}

export default HomesIndexContainer;
