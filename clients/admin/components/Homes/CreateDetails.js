'use strict';

import HomesEditDetails from './EditDetails';
import HomeStore from '../../stores/HomeStore';

let debug = require('../../../common/debugger')('HomesCreateDetails');

export default class HomesCreateDetails extends HomesEditDetails {
  onHomeStoreChange(state) {
    debug('onHomeStoreChange', state);
    let error = HomeStore.getState().error;
    let home = HomeStore.getState().home;

    if (error) {
      this.setState({
        error: error
      });
    }

    if (home && home.slug) {
      debug('Redirect to the newly created home');
      let href = this.context.router.makeHref('homeEdit', {id: state.home.id});
      debug('Redirect url', href);
      window.location.href = href;
    }
  }
}
