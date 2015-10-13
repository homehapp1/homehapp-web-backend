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
import UserStore from '../../stores/UserStore';
import UserActions from '../../actions/UserActions';
import StoryEditBlocks from '../Shared/StoryEditBlocks';
import ApplicationStore from '../../../common/stores/ApplicationStore';

let debug = require('../../../common/debugger')('UsersEditStory');

export default class UsersEditStory extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onUserStoreChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  state = {
    error: null
  }

  componentDidMount() {
    UserStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    UserStore.unlisten(this.storeListener);
  }

  onUserStoreChange(state) {
    debug('onUserStoreChange', state);
    this.setState(state);
  }

  onSave() {
    debug('onSave');
    debug('blocks', this.refs.storyBlocks.getBlocks());
    let userProps = {
      id: this.props.user.id,
      story: {
        blocks: this.refs.storyBlocks.getBlocks(),
        enabled: this.props.user.story.enabled
      }
    };
    console.log('userProps', userProps);
    this.saveUser(userProps);
  }

  saveUser(userProps) {
    debug('Update userProps', userProps);
    UserActions.updateItem(userProps);
  }

  toggleEnabled() {
    // Invert the value and update the view
    this.props.user.story.enabled = !(this.props.user.story.enabled);
    this.forceUpdate();
  }

  render() {
    let blocks = [];
    if (this.props.user.story.blocks) {
      blocks = this.props.user.story.blocks;
    }

    let enabledStatus = {};
    if (this.props.user.story.enabled) {
      enabledStatus = {checked: true};
    }
    debug('User', this.props.user);

    let previewLink = null;
    if (this.props.user) {
      previewLink = (
        <a href={ApplicationStore.getState().config.siteHost + '/user/' + this.props.user.slug}
          target='_blank'
          className='btn btn-primary'>
          Preview
        </a>
      );
    }

    return (
      <Row>
        <form name='userStory' ref='userStoryForm' method='POST'>
          <Col md={10} sm={10}>
            <Panel header='Visibility settings'>
              <Input
                type='checkbox'
                ref='enabled'
                label='Show story on the public site'
                {...enabledStatus}
                addonBefore='Value'
                onChange={this.toggleEnabled.bind(this)}
              />
            </Panel>
            <Panel header='Blocks'>
              <StoryEditBlocks parent={this.props.user} blocks={blocks} ref='storyBlocks' />
            </Panel>
            <Well>
              <Row>
                <Col md={6}>
                  <Button bsStyle='success' accessKey='s' onClick={this.onSave.bind(this)}>Save</Button>
                  {previewLink}
                </Col>
              </Row>
            </Well>
          </Col>
        </form>
      </Row>
    );
  }
}
