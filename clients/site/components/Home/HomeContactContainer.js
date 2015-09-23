'use strict';

import React from 'react';
import HomeContainer from './HomeContainer';
import HomeContact from './HomeContact';

export default class HomeContactContainer extends HomeContainer {
  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }
    if (HomeStore.isLoading() || !this.state.home) {
      return this.handlePendingState();
    }

    return (
      <HomeContact home={this.state.home} />
    );
  }
}
