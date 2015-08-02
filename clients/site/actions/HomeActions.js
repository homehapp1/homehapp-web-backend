'use strict';

import alt from '../../common/alt';
import HomesAPI from '../api/Homes';
import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';

@alt.createActions
class HomeActions {
  updateHome(home) {
    this.dispatch(home);
  }
  fetchHome(slug) {
    this.dispatch();

    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }

    HomesAPI.fetch({slug: slug})
    .then((response) => {
      this.actions.updateHome(response.home);
    })
    .catch((error) => {
      this.actions.fetchFailed(error);
    });
  }
  fetchFailed(error) {
    this.dispatch(error);
  }
}

module.exports = HomeActions;
