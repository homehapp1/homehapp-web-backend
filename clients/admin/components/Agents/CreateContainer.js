'use strict';

import React from 'react';
import AgentListStore from '../../stores/AgentListStore';
import AgentsCreate from './Create';
let blankId = null;

import { createNotification } from '../../../common/Helpers';

export default class AgentsCreateContainer extends React.Component {
  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    agent: AgentListStore.getAgent(blankId)
  }

  componentDidMount() {
    AgentListStore.listen(this.storeListener);
    if (!AgentListStore.getAgent(blankId)) {
      AgentListStore.fetchAgents();
    }
  }

  componentWillUnmount() {
    AgentListStore.unlisten(this.storeListener);
  }

  onChange(/*state*/) {
    this.setState({
      error: AgentListStore.getState().error,
      agent: AgentListStore.getAgent(blankId)
    });
  }

  handlePendingState() {
    createNotification({
      message: 'Creating a new agent template'
    });
    return null;
  }

  handleErrorState() {
    createNotification({
      message: 'Error creating a new agent template',
      type: 'danger'
    });
    return null;
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }

    if (AgentListStore.isLoading() || !this.state.agent) {
      return this.handlePendingState();
    }

    return (
      <AgentsCreate agent={this.state.agent} />
    );
  }
}
