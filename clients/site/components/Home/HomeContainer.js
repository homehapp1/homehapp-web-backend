

import React from 'react';
import HomeStore from '../../stores/HomeStore';
import HomeStory from './HomeStory';
import HomeDetails from './HomeDetails';

import Loading from '../../../common/components/Widgets/Loading';
import ErrorPage from '../../../common/components/Layout/ErrorPage';
import { setPageTitle } from '../../../common/Helpers';

let debug = require('debug')('HomeContainer');

export default class HomeContainer extends React.Component {
  static propTypes = {
    params: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.null
    ])
  }

  constructor(props) {
    super(props);
    this.homeStoreListener = this.homeStoreOnChange.bind(this);
  }

  state = {
    error: null,
    home: HomeStore.getState().home
  }

  componentDidMount() {
    HomeStore.listen(this.homeStoreListener);
    HomeStore.fetchHomeBySlug(this.props.params.slug, true);
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.homeStoreListener);
  }

  homeStoreOnChange(state) {
    this.setState(state);
  }

  handlePendingState() {
    return (
      <Loading>
        <p>Loading story data</p>
      </Loading>
    );
  }

  handleErrorState() {
    let error = {
      title: 'Error loading story!',
      message: this.state.error.message
    };

    return (
      <ErrorPage {...error} />
    );
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }

    if (HomeStore.isLoading() || !this.state.home) {
      return this.handlePendingState();
    }
    debug(this.state.home);
    setPageTitle(this.state.home.pageTitle);

    if (this.state.home.story && this.state.home.story.enabled && this.state.home.story.blocks.length) {
      return (
        <HomeStory home={this.state.home} />
      );
    }

    return (
      <HomeDetails home={this.state.home} />
    );
  }
}
