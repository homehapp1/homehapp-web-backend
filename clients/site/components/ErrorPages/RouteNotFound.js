'use strict';

import React from 'react';
import Error from '../../../common/components/Layout/Error';

class RouteNotFound extends React.Component {
  constructor() {
    super();

    this.error = {
      message: 'Page not found',
      image: {
        url: 'images/content/not-found.jpg',
        alt: 'Page not found',
        type: 'asset'
      }
    };
  }

  render() {
    let error = this.error;

    return (
      <Error {...error} />
    );
  }
}

export default RouteNotFound;
