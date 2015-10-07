/*eslint-env es6 */
'use strict';

import React from 'react';

// Internal components
import HomeListStore from '../../stores/HomeListStore';
import ErrorPage from '../../../common/components/Layout/ErrorPage';

// Home List
import HomeList from './HomeList';

// Story widgets
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Loading from '../../../common/components/Widgets/Loading';

import { setPageTitle } from '../../../common/Helpers';

export default class HomeSearch extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  };

  constructor() {
    super();
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    homes: HomeListStore.getState().homes
  };

  componentDidMount() {
    HomeListStore.listen(this.storeListener);
    HomeListStore.fetchHomes({limit: 20});
  }

  componentWillUnmount() {
    HomeListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    this.setState(state);
  }

  handlePendingState() {
    return (
      <Loading>
        <p>Loading homes...</p>
      </Loading>
    );
  }

  handleErrorState() {
    let error = {
      title: 'Error loading homes!',
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

    if (HomeListStore.isLoading()) {
      return this.handlePendingState();
    }

    let mode = 'sale';

    if (this.props.params && this.props.params.mode) {
      mode = this.props.params.mode;
    }
    setPageTitle(`Our exclusive properties for ${mode}`);

    return (
      <div id='propertyFilter'>
        <ContentBlock className='padded'>
          <h1>Our exclusive properties for {mode}</h1>
        </ContentBlock>
        <HomeList items={this.state.homes} />
      </div>
    );
  }
}
