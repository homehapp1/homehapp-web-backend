'use strict';

import React from 'react';
import AgentListStore from '../../stores/AgentListStore';
import AgentsIndex from './index';

import Loading from '../../../common/components/Widgets/Loading';

class AgentsIndexContainer extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    agents: AgentListStore.getState().agents
  }

  componentDidMount() {
    AgentListStore.listen(this.storeListener);
    AgentListStore.fetchAgents();
  }

  componentWillUnmount() {
    AgentListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    this.setState(state);
  }

  handlePendingState() {
    return (
      <Loading>
        <h3>Loading agents...</h3>
      </Loading>
    );
  }

  handleErrorState() {
    return (
      <div className='agents-error'>
        <h3>Error loading agents!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }
    if (AgentListStore.isLoading() || !this.state.agents) {
      return this.handlePendingState();
    }

    return (
      <AgentsIndex agents={this.state.agents} />
    );
  }
}

export default AgentsIndexContainer;
