'use strict';

import React from 'react';
import ErrorPage from '../../../common/components/Layout/ErrorPage';

class RouteNotFound extends React.Component {
  componentWillMount() {
    this.error = {
      title: 'Not found!',
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
      <ErrorPage {...error} />
    );
  }
}

export default RouteNotFound;
