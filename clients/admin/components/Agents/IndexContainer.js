'use strict';

import React from 'react';
import AgentListStore from '../../stores/AgentListStore';
import Index from './index';

import Loading from '../../../common/components/Widgets/Loading';

class AgentsIndexContainer extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  componentDidMount() {
    AgentListStore.listen(this.storeListener);
    AgentListStore.fetchItems();
  }

  componentWillUnmount() {
    AgentListStore.unlisten(this.storeListener);
  }

  state = {
    error: null,
    items: AgentListStore.getState().items
  }

  onChange(state) {
      console.log('AgentsIndexContainer:onChange', state);
      if (state.removed) {
        window.location.reload();
      }
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
    if (AgentListStore.isLoading() || !this.state.items) {
      return this.handlePendingState();
    }

    return (
      <Index items={this.state.items} />
    );
  }
}

export default AgentsIndexContainer;
