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
import HomeStore from '../../stores/HomeStore';
import HomeActions from '../../actions/HomeActions';
import StoryEditBlocks from './StoryEditBlocks';

let debug = require('../../../common/debugger')('HomesEditStory');

export default class HomesEditStory extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onHomeStoreChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  state = {
    error: null
  }

  componentDidMount() {
    HomeStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.storeListener);
  }

  onHomeStoreChange(state) {
    debug('onHomeStoreChange', state);
    this.setState(state);
  }

  onSave() {
    debug('onSave');
    debug('blocks', this.refs.storyBlocks.state.blocks);
    let homeProps = {
      uuid: this.props.home.id,
      story: {
        blocks: this.refs.storyBlocks.state.blocks,
        enabled: this.props.home.story.enabled
      }
    };

    this.saveHome(homeProps);
  }

  saveHome(homeProps) {
    debug('Update homeProps', homeProps);
    HomeActions.updateItem(homeProps);
  }

  handlePendingState() {
    return (
      <div className='home-saving'>
        <h3>Saving home...</h3>
      </div>
    );
  }

  handleErrorState() {
    return (
      <div className='home-error'>
        <h3>Error updating home!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  toggleEnabled() {
    // Invert the value and update the view
    this.props.home.story.enabled = !(this.props.home.story.enabled);
    this.forceUpdate();
  }

  render() {
    let error = null;
    let savingLoader = null;
    if (this.state.error) {
      error = this.handleErrorState();
    }
    if (HomeStore.isLoading()) {
      savingLoader = this.handlePendingState();
    }

    let blocks = [];
    if (this.props.home.story.blocks) {
      blocks = this.props.home.story.blocks;
    }

    let enabledStatus = {};
    if (this.props.home.story.enabled) {
      enabledStatus = {checked: true};
    }
    debug('Home', this.props.home);

    return (
      <Row>
        {error}
        {savingLoader}
        <form name='homeStory' ref='homeStoryForm' method='POST'>
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
