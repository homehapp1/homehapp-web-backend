/*eslint-env es6 */
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

// let debug = require('debug')('HomeSearch');

export default class HomeSearch extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    homes: HomeListStore.getState().items
  }

  componentDidMount() {
    HomeListStore.listen(this.storeListener);

    if (!HomeListStore.getState().items) {
      HomeListStore.fetchItems({story: true});
    }

    setPageTitle(`Our home stories`);
  }

  componentWillUnmount() {
    HomeListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    this.setState({
      error: state.error,
      homes: state.items
    });
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

    let homes = this.state.homes || [];

    return (
      <div id='propertyFilter'>
        <ContentBlock className='padded'>
          <h1>Our home stories</h1>
        </ContentBlock>
        <HomeList items={homes} />
      </div>
    );
  }
}
