import React from 'react';
import { Link } from 'react-router';

// Bootstrap components
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import InputWidget from '../Widgets/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';

import ApplicationStore from '../../../common/stores/ApplicationStore';
import PageStore from '../../stores/PageStore';
import PageActions from '../../actions/PageActions';
import StoryEditBlocks from '../Shared/StoryEditBlocks';

import { createNotification, merge } from '../../../common/Helpers';

let debug = require('debug')('PagesDetails');

export default class PagesDetails extends React.Component {
  static propTypes = {
    page: React.PropTypes.object,
    context: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.func
  }

  static defaultProps = {
    page: {
      id: null,
      title: '',
      slug: '',
      story: {
        enabled: true,
        blocks: []
      }
    }
  }

  constructor() {
    super();
    this.storeListener = this.onPageStoreChange.bind(this);
  }

  state = {
    model: null,
    error: null
  }

  componentDidMount() {
    PageStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    PageStore.unlisten(this.storeListener);
  }

  onPageStoreChange(state) {
    debug('onPageStoreChange', state);
    this.setState(state);
    debug('this.state', this.state);

    if (state.model && state.model.id) {
      setTimeout(() => {
        this.context.router.transitionTo('pageEdit', {id: state.model.id});
      }, 100);
    }
  }

  onFormChange() {
    debug('Value changed');
  }

  onSave() {
    debug('Saving');
    for (let key in this.refs) {
      let ref = this.refs[key];
      if (typeof ref.isValid !== 'function') {
        continue;
      }

      if (!ref.isValid()) {
        debug('Validation failed', ref);
        let label = ref.props.label || 'Validation error';
        let message = ref.message || 'Field failed the validation';

        createNotification({
          type: 'danger',
          duration: 10,
          label: label,
          message: message
        });
        return false;
      }
    }

    let page = {
      id: this.props.page.id || null,
      title: this.refs.title.getValue(),
      slug: this.refs.slug.getValue(),
      story: {
        enabled: true,
        blocks: this.refs.storyBlocks.getBlocks()
      }
    };

    if (page.id) {
      return PageActions.updateItem(page);
    }
    return PageActions.createItem(page);
  }

  handleErrorState() {
    if (!this.state.error) {
      return null;
    }

    createNotification({
      label: 'Save failed',
      message: this.state.error.message,
      type: 'danger'
    });
  }

  handlePendingState() {
    debug('@TODO: handlePendingState');
    // createNotification({
    //   label: 'Saving page',
    //   message: 'Please wait a moment',
    // });
  }

  render() {
    this.handleErrorState();
    this.handlePendingState();
    debug('merging');

    let page = merge(
      {
        title: '',
        slug: '',
        story: {
          enabled: true,
          blocks: []
        }
      },
      this.props.page || {},
      this.state.model || {}
    );
    debug('merged', page);

    let deleteLink = null;
    let previewLink = null;

    if (page.id) {
      deleteLink = (<Link to='pageDelete' params={{id: page.id}} className='pull-right btn btn-danger btn-preview'>Delete</Link>);
      previewLink = (
        <a href={`${ApplicationStore.getState().config.siteHost}/${page.slug}`}
          target='_blank'
          className='btn btn-primary'>
          Preview
        </a>
      );
    }

    return (
      <Row>
        <form method='post'>
          <Col md={10} sm={10}>
            <Panel header='Common'>
              <InputWidget
                type='text'
                ref='title'
                label='Title'
                placeholder='Title'
                required
                defaultValue={page.title}
                onChange={this.onFormChange.bind(this)}
              />
              <InputWidget
                type='text'
                ref='slug'
                label='URL name'
                placeholder='URL name (only lowercase alphanumeric, - and _ are allowed)'
                required
                pattern='[a-z0-9\-_]+'
                defaultValue={page.slug}
                onChange={this.onFormChange.bind(this)}
              />
            </Panel>
            <StoryEditBlocks parent={page} blocks={page.story.blocks} ref='storyBlocks' />
            <Well>
              <Row>
                <Col md={6}>
                  <Button bsStyle='success' accessKey='s' onClick={this.onSave.bind(this)}>Save</Button>
                  {previewLink}
                </Col>
                <Col md={6} pullRight>
                  {deleteLink}
                </Col>
              </Row>
            </Well>
          </Col>
        </form>
      </Row>
    );
  }
}
