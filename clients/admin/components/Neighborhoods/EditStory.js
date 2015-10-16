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
import NeighborhoodStore from '../../stores/NeighborhoodStore';
// import NeighborhoodActions from '../../actions/NeighborhoodActions';
import StoryEditBlocks from '../Shared/StoryEditBlocks';

let debug = require('../../../common/debugger')('NeighborhoodsEditStory');

export default class NeighborhoodsEditStory extends React.Component {
  static propTypes = {
    neighborhood: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onNeighborhoodStoreChange.bind(this);
  }

  componentDidMount() {
    NeighborhoodStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    NeighborhoodStore.unlisten(this.storeListener);
  }

  state = {
    error: null
  }

  onNeighborhoodStoreChange(state) {
    debug('onNeighborhoodStoreChange', state);
    this.setState(state);
  }

  onSave() {
    debug('save');
  }

  handlePendingState() {
    return (
      <div className='neighborhood-saving'>
        <h3>Saving neighborhood...</h3>
      </div>
    );
  }

  handleErrorState() {
    return (
      <div className='neighborhood-error'>
        <h3>Error updating neighborhood!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  render() {
    let error = null;
    let savingLoader = null;
    if (this.state.error) {
      error = this.handleErrorState();
    }
    if (NeighborhoodStore.isLoading()) {
      savingLoader = this.handlePendingState();
    }

    let blocks = [];
    if (this.props.neighborhood.story.blocks) {
      blocks = this.props.neighborhood.story.blocks;
    }

    let enabledStatus = {};
    if (this.props.neighborhood.story.enabled) {
      enabledStatus = {checked: true};
    }

    return (
      <Row>
        {error}
        {savingLoader}
        <form name='neighborhoodStory' ref='neighborhoodStoryForm' method='POST'>
          <Col md={10} sm={10}>
            <Panel header='Common'>
              <Input
                type='checkbox'
                label='Enabled'
                {...enabledStatus}
              />
            </Panel>
            <Panel header='Blocks'>
              <StoryEditBlocks blocks={blocks} />
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
