'use strict';

import React from 'react';

class RouteNotFound extends React.Component {
  render() {
    return (
      <div className='errorPage'>
        <h1>Oh No`s! Route does not exist.</h1>
      </div>
    );
  }
}

export default RouteNotFound;
