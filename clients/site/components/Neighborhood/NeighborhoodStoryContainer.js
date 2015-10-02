'use strict';

import React from 'react';
import NeighborhoodContainer from './NeighborhoodContainer';
import NeighborhoodStore from '../../stores/NeighborhoodStore';
import NeighborhoodStory from './NeighborhoodStory';

// let debug = require('../../../common/debugger')('NeighborhoodStoryContainer');

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
