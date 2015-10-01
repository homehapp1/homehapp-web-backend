'use strict';

import React from 'react';
import NeighborhoodContainer from './NeighborhoodContainer';
import Neighborhoodtore from '../../stores/NeighborhoodStore';
import NeighborhoodStory from './NeighborhoodStory';

export default class NeighborhoodStoryContainer extends NeighborhoodContainer {
  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }
    if (NeighborhoodStore.isLoading() || !this.state.neighborhood) {
      return this.handlePendingState();
    }

    return (
      <NeighborhoodStory neighborhood={this.state.neighborhood} />
    );
  }
}
