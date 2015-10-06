'use strict';

import AgentsEditDetails from './EditDetails';
import AgentActions from '../../actions/AgentActions';

let debug = require('../../../common/debugger')('AgentsCreateDetails');

export default class AgentsCreateDetails extends AgentsEditDetails {
  saveAgent(agentProps) {
    debug('Create agentProps', agentProps);
    let action = AgentActions.createItem(agentProps);
    debug('Action', action);
    action.then(() => {
      debug('promise arguments', arguments);
    });
  }

  onAgentStoreChange(state) {
    debug('onAgentStoreChange', state);
    this.setState(state);

    if (state.agent && state.agent.id) {
      debug('Redirect to the newly created agent');
      let href = this.context.router.makeHref('agentEdit', {id: state.agent.id});
      debug('Redirect url', href);
      this.context.router.transitionTo('agentEdit', {id: state.agent.id});
    }
  }
}
