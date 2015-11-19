import React from 'react';
// import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
// import Table from 'react-bootstrap/lib/Table';
import InputWidget from '../Widgets/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import HomeStore from '../../stores/HomeStore';
import HomeActions from '../../actions/HomeActions';
import StoryEditBlocks from '../Shared/StoryEditBlocks';
import ApplicationStore from '../../../common/stores/ApplicationStore';

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

  onChange(blocks) {
    debug('onInput', blocks);
  }

  onSave() {
    debug('onSave');
    debug('blocks', this.refs.storyBlocks.getBlocks());
    let homeProps = {
      id: this.props.home.id,
      story: {
        blocks: this.refs.storyBlocks.getBlocks(),
        enabled: this.props.home.story.enabled
      }
    };
    this.saveHome(homeProps);
  }

  saveHome(homeProps) {
    debug('Update homeProps', homeProps);
    HomeActions.updateItem(homeProps);
  }

  toggleEnabled() {
    // Invert the value and update the view
    this.props.home.story.enabled = !(this.props.home.story.enabled);
    this.forceUpdate();
  }

  render() {
    let blocks = [];
    if (this.props.home.story.blocks) {
      blocks = this.props.home.story.blocks;
    }

    let enabledStatus = {};
    if (this.props.home.story.enabled) {
      enabledStatus = {checked: true};
    }
    debug('Home', this.props.home);

    let previewLink = null;
    if (this.props.home) {
      previewLink = (
        <a href={`${ApplicationStore.getState().config.siteHost}/homes/${this.props.home.slug}/story`}
          target='_blank'
          className='btn btn-primary'>
          Preview
        </a>
      );
    }

    return (
      <Row>
        <form name='homeStory' ref='homeStoryForm' method='POST'>
          <Col md={10} sm={10}>
            <Panel header='Visibility settings'>
              <InputWidget
                type='checkbox'
                ref='enabled'
                label='Story visible'
                {...enabledStatus}
                addonBefore='Value'
                onChange={this.toggleEnabled.bind(this)}
              />
            </Panel>
            <StoryEditBlocks parent={this.props.home} blocks={blocks} disabled={['HTMLContent']} ref='storyBlocks' onChange={this.onChange.bind(this)} />
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
