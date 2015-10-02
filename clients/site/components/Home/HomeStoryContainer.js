'use strict';

import React from 'react';
import HomeContainer from './HomeContainer';
import HomeStore from '../../stores/HomeStore';
import HomeStory from './HomeStory';

export default class HomeStoryContainer extends HomeContainer {
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