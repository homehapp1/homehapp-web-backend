'use strict';

import React from 'react';
import AgentListStore from '../../stores/AgentListStore';
import AgentsDelete from './Delete';
import Loading from '../../../common/components/Widgets/Loading';
let debug = require('debug')('DeleteContainer');

export default class AgentsDeleteContainer extends React.Component {
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
        <h3>Loading agent...</h3>
      </Loading>
    );
  }

  handleErrorState() {
    return (
      <div className='agents-error'>
        <h3>Error loading agent!</h3>
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
      <AgentsDelete agent={this.state.agent} />
    );
  }
}
