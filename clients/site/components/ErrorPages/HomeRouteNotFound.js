'use strict';

import RouteNotFound from './RouteNotFound';

class HomeRouteNotFound extends RouteNotFound {
  componentWillMount() {
    console.log('componentWillMount', this);
    this.error.message = 'Home not found';
  }
}

export default HomeRouteNotFound;
