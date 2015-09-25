/*eslint-env es6 */
'use strict';

import React from 'react';

// Internal components
import HomeListStore from '../../stores/HomeListStore';
import ErrorPage from '../../../common/components/Layout/ErrorPage';

// Property List
import PropertyList from './List';

// Story widgets
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Icon from '../../../common/components/Widgets/Icon';
import LargeText from '../../../common/components/Widgets/LargeText';
import Loading from '../../../common/components/Widgets/Loading';

export default class PropertyFilter extends React.Component {
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

    let defaultImage = {
      src: 'images/content/content-placeholder.jpg',
      alt: ''
    };

    let mode = 'sale';

    if (this.props.params && this.props.params.mode) {
      mode = this.props.params.mode;
    }

    return (
      <div id='propertyFilter'>
        <ContentBlock className='padded'>
          <h1>Our exclusive properties for {mode}</h1>
        </ContentBlock>
        <PropertyList items={this.state.homes} />
      </div>
    );
  }
}
