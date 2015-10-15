'use strict';

import AgentsEditDetails from './EditDetails';
import AgentStore from '../../stores/AgentStore';
import AgentActions from '../../actions/AgentActions';

let debug = require('../../../common/debugger')('AgentsCreateDetails');

export default class AgentsCreateDetails extends AgentsEditDetails {
  onAgentStoreChange(state) {
    debug('onAgentStoreChange', state);
    let error = AgentStore.getState().error;
    let agent = AgentStore.getState().agent;

    if (error) {
      this.setState({
        error: error
      });
    }
    // For the sake of convenience just check the beginning of the string
    if (agent) {
      debug('Redirect to the newly created agent');
      let href = this.context.router.makeHref('agentEdit', {id: state.agent.id});
      debug('Redirect url', href);
      window.location.href = href;
    }
  }

  saveAgent(agentProps) {
    debug('Create with agentProps', agentProps);
    AgentActions.createItem(agentProps);
  }
}
