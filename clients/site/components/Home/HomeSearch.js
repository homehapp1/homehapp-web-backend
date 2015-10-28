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

let debug = require('debug')('HomeSearch');

export default class HomeSearch extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
    this.state.type = props.params.mode || 'buy';
  }

  state = {
    error: null,
    type: 'buy',
    homes: HomeListStore.getState().homes
  }

  componentWillReceiveProps(props) {
    let type = props.params.mode || this.state.type || 'buy';
    debug('componentWillReceiveProps', props.params, type);
    this.setState({
      type: type
    });
    let filters = {type: type};
    debug('Filters in componentWillReceiveProps', filters);
    this.updateFilters(filters);
  }

  componentDidMount() {
    HomeListStore.listen(this.storeListener);
    let filters = {type: this.props.params.mode || this.state.type};
    debug('Filters in compontDidMount', filters, this.props.params);
    this.updateFilters(filters);
  }

  componentWillUnmount() {
    HomeListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    this.setState(state);
  }

  updateFilters(filters = {}) {
    debug('Filters', filters);
    HomeListStore.fetchHomes(filters);
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

    setPageTitle(`Our exclusive properties for ${this.state.type}`);

    return (
      <div id='propertyFilter'>
        <ContentBlock className='padded'>
          <h1>Our exclusive properties for {this.state.type}</h1>
        </ContentBlock>
        <HomeList items={this.state.homes} />
      </div>
    );
  }
}
