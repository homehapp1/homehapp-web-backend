'use strict';

import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Table from 'react-bootstrap/lib/Table';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import HomeStore from '../../stores/HomeStore';
import HomeActions from '../../actions/HomeActions';
import ApplicationStore from '../../../common/stores/ApplicationStore';
import UploadArea from '../../../common/components/UploadArea';
import UploadAreaUtils from '../../../common/components/UploadArea/utils';
import StoryEditBlocks from './StoryEditBlocks';
import {randomNumericId, enumerate, setCDNUrlProperties} from '../../../common/Helpers';

let debug = require('../../../common/debugger')('HomesEditStory');

function getFullImageUrl(url) {
  if (!url.match(/^http/)) {
    url = `${ApplicationStore.getState().config.cloudinary.baseUrl}${url}`;
  }
  return url;
}

export default class HomesEditStory extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onHomeStoreChange.bind(this);
    this.uploadListener = this.onUploadChange.bind(this);
  }

  componentDidMount() {
    HomeStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.storeListener);
  }

  state = {
    error: null,
    uploads: UploadAreaUtils.UploadStore.getState().uploads,
    currentAttributes: this.props.home.attributes,
    homeImages: []
  }

  onHomeStoreChange(state) {
    debug('onHomeStoreChange', state);
    this.setState(state);
  }

  onUploadChange(state) {
    debug('onUploadChange', state);
    this.setState({
      uploads: UploadAreaUtils.UploadStore.getState().uploads
    });
  }

  onSave() {
    debug('save');
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

    return (
      <Row>
        {error}
        {savingLoader}
        <form name='homeStory' ref='homeStoryForm' method='POST'>
          <Col md={10} sm={10}>
            <Panel header='Common'>
              <Input
                type='checkbox'
                label='Enabled'
                {...enabledStatus}
              />
            </Panel>
            <Panel header='Blocks'>
              <StoryEditBlocks blocks={blocks}></StoryEditBlocks>
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
