'use strict';

import React from 'react';
import NeighborhoodStore from '../../stores/NeighborhoodStore';
import NeighborhoodStory from './NeighborhoodStory';

import Loading from '../../../common/components/Widgets/Loading';
import ErrorPage from '../../../common/components/Layout/ErrorPage';
import { setPageTitle } from '../../../common/Helpers';

let debug = require('../../../common/debugger')('NeighborhoodContainer');

export default class NeighborhoodContainer extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  };

  constructor() {
    super();
    this.neighborhoodStoreListener = this.neighborhoodStoreOnChange.bind(this);
  }

  componentDidMount() {
    NeighborhoodStore.listen(this.neighborhoodStoreListener);
    NeighborhoodStore.fetchNeighborhoodBySlug(this.props.params.city, this.props.params.neighborhood, true);
  }

  componentWillUnmount() {
    NeighborhoodStore.unlisten(this.neighborhoodStoreListener);
  }

  state = {
    error: null,
    neighborhood: NeighborhoodStore.getState().neighborhood
  }

  neighborhoodStoreOnChange(state) {
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
    debug('Failed to load neighborhood', this.state.error);
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

    if (NeighborhoodStore.isLoading() || !this.state.neighborhood) {
      return this.handlePendingState();
    }
    setPageTitle(this.state.neighborhood.pageTitle);

    return (
      <NeighborhoodStory neighborhood={this.state.neighborhood} />
    );
  }
}
