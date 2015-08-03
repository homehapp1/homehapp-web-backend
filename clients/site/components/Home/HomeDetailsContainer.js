'use strict';

import React from 'react';
import HomeContainer from './HomeContainer';
import HomeStore from '../../stores/HomeStore';
import HomeDetails from './Details';

class HomeDetailsContainer extends HomeContainer {

  render() {
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

export default HomeDetailsContainer;
