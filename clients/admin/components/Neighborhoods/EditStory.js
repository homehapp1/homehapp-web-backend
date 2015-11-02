import React from 'react';
// import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
// import Table from 'react-bootstrap/lib/Table';
import InputWidget from '../Widgets/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import NeighborhoodStore from '../../stores/NeighborhoodStore';
import NeighborhoodActions from '../../actions/NeighborhoodActions';
import StoryEditBlocks from '../Shared/StoryEditBlocks';
import ApplicationStore from '../../../common/stores/ApplicationStore';

let debug = require('debug')('NeighborhoodsEditStory');

export default class NeighborhoodsEditStory extends React.Component {
  static propTypes = {
    neighborhood: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onNeighborhoodStoreChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  state = {
    error: null
  }

  componentDidMount() {
    NeighborhoodStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    NeighborhoodStore.unlisten(this.storeListener);
  }

  onNeighborhoodStoreChange(state) {
    debug('onNeighborhoodStoreChange', state);
    this.setState(state);
  }

  onSave() {
    debug('onSave');
    debug('blocks', this.refs.storyBlocks.getBlocks());
    let neighborhoodProps = {
      id: this.props.neighborhood.id,
      story: {
        blocks: this.refs.storyBlocks.getBlocks(),
        enabled: this.props.neighborhood.story.enabled
      }
    };
    debug('neighborhoodProps', neighborhoodProps);
    this.saveNeighborhood(neighborhoodProps);
  }

  saveNeighborhood(neighborhoodProps) {
    debug('Update neighborhoodProps', neighborhoodProps);
    NeighborhoodActions.updateItem(neighborhoodProps);
  }

  toggleEnabled() {
    // Invert the value and update the view
    this.props.neighborhood.story.enabled = !(this.props.neighborhood.story.enabled);
    this.forceUpdate();
  }

  render() {
    let blocks = [];
    if (this.props.neighborhood.story.blocks) {
      blocks = this.props.neighborhood.story.blocks;
    }

    let enabledStatus = {};
    if (this.props.neighborhood.story.enabled) {
      enabledStatus = {checked: true};
    }
    debug('Neighborhood', this.props.neighborhood);

    let previewLink = null;
    if (this.props.neighborhood && this.props.neighborhood.location.city) {
      previewLink = (
        <a href={`${ApplicationStore.getState().config.siteHost}/neighborhoods/${this.props.neighborhood.location.city.slug}/${this.props.neighborhood.slug}`}
          target='_blank'
          className='btn btn-primary'>
          Preview
        </a>
      );
    }

    return (
      <Row>
        <form name='neighborhoodStory' ref='neighborhoodStoryForm' method='POST'>
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
            <StoryEditBlocks parent={this.props.neighborhood} blocks={blocks} disabled={['HTMLContent']} ref='storyBlocks' />
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
