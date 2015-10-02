'use strict';

import HomesEditDetails from './EditDetails';
import HomeActions from '../../actions/HomeActions';

let debug = require('../../../common/debugger')('HomesCreateDetails');
const countries = require('../../../common/lib/Countries').forSelect();

export default class HomesCreateDetails extends HomesEditDetails {
  saveHome(homeProps) {
    debug('Create homeProps', homeProps);
    let action = HomeActions.createItem(homeProps);
    debug('Action', action);
    action.then(() => {
      debug('promise arguments', arguments);
    });
  }

  onHomeStoreChange(state) {
    debug('onHomeStoreChange', state);
    this.setState(state);

    if (state.home && state.home.id) {
      debug('Redirect to the newly created home');
      let href = this.context.router.makeHref('homeEdit', {id: state.home.id});
      debug('Redirect url', href);
      this.context.router.transitionTo('homeEdit', {id: state.home.id});
    }
  }
}
