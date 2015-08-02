'use strict';

import React from 'react';
import HomeContainer from './HomeContainer';
import HomeDetails from './Details';

class HomeDetailsContainer extends HomeContainer {

  render() {
    if (this.state.loading || !this.state.home) {
      return this.handlePendingState();
    } else if (this.state.error) {
      return handleErrorState();
    }

    return (
      <HomeDetails home={this.state.home} />
    );
  }
}

export default HomeDetailsContainer;
