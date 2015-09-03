'use strict';

import React from 'react';

import RouteNotFound from './RouteNotFound';
import ErrorPage from '../../../common/components/Layout/ErrorPage';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';

class HomeRouteNotFound extends RouteNotFound {
  componentWillMount() {
    super.componentWillMount();
    this.error.message = 'Home not found';
  }

  render() {
    let error = this.error;

    return (
      <ErrorPage {...error} />
    );
  }
}

export default HomeRouteNotFound;
