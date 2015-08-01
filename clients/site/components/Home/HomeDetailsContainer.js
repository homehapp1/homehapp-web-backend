'use strict';

import React from 'react';
import HomeContainer from './HomeContainer';
import HomeDetails from './Details';

class HomeDetailsContainer extends HomeContainer {

  render() {
    if (this.state.loading || !this.state.home) {
      return (
        <div className='story-loader'>
          <h3>Loading story data...</h3>
        </div>
      );
    } else if (this.state.error) {
      return (
        <div className='story-error'>
          <h3>Error loading story!</h3>
          <p>{this.state.error.message}</p>
        </div>
      );
    }

    return (
      <HomeDetails home={this.state.home} />
    );
  }
}

export default HomeDetailsContainer;
