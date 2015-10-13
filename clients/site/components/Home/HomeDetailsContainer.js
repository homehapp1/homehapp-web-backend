'use strict';

import React from 'react';
import HomeContainer from './HomeContainer';
import HomeStore from '../../stores/HomeStore';
import HomeDetails from './HomeDetails';

let debug = require('debug')('HomeDetailsContainer');

export default class HomeDetailsContainer extends HomeContainer {
  render() {
    debug('Render', this.state.home, this.props);
    if (this.state.error) {
      return this.handleErrorState();
    }
    if (HomeStore.isLoading() || !this.state.home) {
      return this.handlePendingState();
    }

    return (
      <HomeDetails home={this.state.home} />
    );
  }
}
