'use strict';

import React from 'react';
import AgentListStore from '../../stores/AgentListStore';
import AgentsEdit from './Edit';
import Loading from '../../../common/components/Widgets/Loading';
let debug = require('debug')('EditContainer');

export default class AgentsEditContainer extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    agent: AgentListStore.getAgent(this.props.params.id)
  }

  componentDidMount() {
    AgentListStore.listen(this.storeListener);
    if (!AgentListStore.getAgent(this.props.params.id)) {
      AgentListStore.fetchAgents();
    }
  }

  componentWillUnmount() {
    AgentListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    debug('state', state, AgentListStore.getState());
    this.setState({
      error: AgentListStore.getState().error,
      agent: AgentListStore.getAgent(this.props.params.id)
    });
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
    debug('Agent', this.state.agent);

    if (AgentListStore.isLoading() || !this.state.agent) {
      return this.handlePendingState();
    }

    return (
      <AgentsEdit agent={this.state.agent} />
    );
  }
}
