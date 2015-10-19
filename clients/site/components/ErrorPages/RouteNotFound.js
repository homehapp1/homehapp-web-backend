

import React from 'react';
import ErrorPage from '../../../common/components/Layout/ErrorPage';

export default class RouteNotFound extends React.Component {
  componentWillMount() {
    this.error = {
      title: 'Not found!',
      // image: {
      //   url: 'images/content/not-found.jpg',
      //   alt: 'Page not found',
      //   author: '',
      //   type: 'asset'
      // },
      message: 'Page not found'
    };
  }

  render() {
    return (
      <ErrorPage {...this.error} />
    );
  }
}
