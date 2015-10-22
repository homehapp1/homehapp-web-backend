import React from 'react';
import PageStore from '../../stores/PageStore';
import { setPageTitle } from '../../../common/Helpers';

import ErrorPage from '../../../common/components/Layout/ErrorPage';
import Loading from '../../../common/components/Widgets/Loading';
import StoryLayout from '../../../common/components/Layout/StoryLayout';

let debug = require('debug')('Page');

export default class Page extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.storeListener = this.onStateChange.bind(this);
  }

  state = {
    page: null,
    error: null
  }

  componentDidMount() {
    // setPageTitle();
    PageStore.listen(this.storeListener);
    if (!PageStore.getItem(this.props.params.slug)) {
      PageStore.fetchItem(this.props.params.slug);
    }
  }

  componentWillUnmount() {
    PageStore.unlisten(this.storeListener);
  }

  onStateChange(state) {
    debug('onStateChange', state);
    this.setState({
      page: state.model,
      error: state.error
    });

    if (state.model && state.model.title) {
      setPageTitle(state.model.title);
    }
  }

  handleErrorState() {
    let error = {
      title: 'Error loading page!',
      message: this.state.error.message
    };

    return (
      <ErrorPage {...error} />
    );
  }

  handlePendingState() {
    return (
      <Loading>
        <p>Loading page...</p>
      </Loading>
    );
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }

    if (PageStore.isLoading() || !this.state.page) {
      return this.handlePendingState();
    }

    let blocks = [];

    if (this.state.page.story && this.state.page.story.blocks && this.state.page.story.blocks.length) {
      blocks = this.state.page.story.blocks;
    } else {
      blocks.push({
        template: 'ContentBlock',
        properties: {
          title: this.state.page.title
        }
      });
    }

    return (
      <StoryLayout blocks={blocks} />
    );
  }
}
