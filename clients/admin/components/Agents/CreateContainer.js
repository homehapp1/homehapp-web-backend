'use strict';

import React from 'react';
import AgentListStore from '../../stores/AgentListStore';
import AgentsCreate from './Create';
import NotificationLayout from '../Layout/NotificationLayout';
let blankId = null;

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
    return (
      <NotificationLayout>
        <h3>Creating a new agent template...</h3>
      </NotificationLayout>
    );
  }

  handleErrorState() {
    return (
      <div className='agents-error'>
        <h3>Error creating a new agent template!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
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
