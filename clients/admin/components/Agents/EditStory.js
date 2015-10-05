'use strict';

import React from 'react';
// import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
// import Table from 'react-bootstrap/lib/Table';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import AgentStore from '../../stores/AgentStore';
import AgentActions from '../../actions/AgentActions';
import StoryEditBlocks from './StoryEditBlocks';

let debug = require('../../../common/debugger')('AgentsEditStory');

export default class AgentsEditStory extends React.Component {
  static propTypes = {
    agent: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onAgentStoreChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  state = {
    error: null
  }

  componentDidMount() {
    AgentStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    AgentStore.unlisten(this.storeListener);
  }

  onAgentStoreChange(state) {
    debug('onAgentStoreChange', state);
    this.setState(state);
  }

  onSave() {
    debug('onSave');
    debug('blocks', this.refs.storyBlocks.state.blocks);
    let agentProps = {
      uuid: this.props.agent.id,
      story: {
        blocks: this.refs.storyBlocks.state.blocks,
        enabled: this.props.agent.story.enabled
      }
    };

    this.saveAgent(agentProps);
  }

  saveAgent(agentProps) {
    debug('Update agentProps', agentProps);
    AgentActions.updateItem(agentProps);
  }

  handlePendingState() {
    return (
      <div className='agent-saving'>
        <h3>Saving agent...</h3>
      </div>
    );
  }

  handleErrorState() {
    return (
      <div className='agent-error'>
        <h3>Error updating agent!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  toggleEnabled() {
    // Invert the value and update the view
    this.props.agent.story.enabled = !(this.props.agent.story.enabled);
    this.forceUpdate();
  }

  render() {
    let error = null;
    let savingLoader = null;
    if (this.state.error) {
      error = this.handleErrorState();
    }
    if (AgentStore.isLoading()) {
      savingLoader = this.handlePendingState();
    }

    let blocks = [];
    if (this.props.agent.story.blocks) {
      blocks = this.props.agent.story.blocks;
    }

    let enabledStatus = {};
    if (this.props.agent.story.enabled) {
      enabledStatus = {checked: true};
    }
    debug('Agent', this.props.agent);

    return (
      <Row>
        {error}
        {savingLoader}
        <form name='agentStory' ref='agentStoryForm' method='POST'>
          <Col md={10} sm={10}>
            <Panel header='Common'>
              <Input
                type='checkbox'
                ref='enabled'
                label='Enabled'
                {...enabledStatus}
                addonBefore='Value'
                onChange={this.toggleEnabled.bind(this)}
              />
            </Panel>
            <Panel header='Blocks'>
              <StoryEditBlocks blocks={blocks} ref='storyBlocks' />
            </Panel>
            <Well>
              <Row>
                <Col md={6}>
                  <Button bsStyle='success' accessKey='s' onClick={this.onSave.bind(this)}>Save</Button>
                </Col>
              </Row>
            </Well>
          </Col>
        </form>
      </Row>
    );
  }
}
