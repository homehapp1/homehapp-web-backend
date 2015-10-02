'use strict';

import React from 'react';
import NeighborhoodContainer from './NeighborhoodContainer';
import NeighborhoodHomeFilter from './NeighborhoodHomeFilter';
import NeighborhoodStore from '../../stores/NeighborhoodStore';

let debug = require('../../../common/debugger')('NeighborhoodHomeFilterContainer');

export default class NeighborhoodHomeFilterContainer extends NeighborhoodContainer {
  render() {
    debug('Render');
    if (this.state.error) {
      return this.handleErrorState();
    }
    if (NeighborhoodStore.isLoading() || !this.state.neighborhood) {
      return this.handlePendingState();
    }

    return (
      <NeighborhoodHomeFilter neighborhood={this.state.neighborhood} />
    );
  }
}
