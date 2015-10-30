/*eslint-env es6 */
import React from 'react';

// Internal components
import HomeListStore from '../../stores/HomeListStore';
import ErrorPage from '../../../common/components/Layout/ErrorPage';

// Home List
import HomeList from './HomeList';

// Story widgets
import BigImage from '../../../common/components/Widgets/BigImage';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import LargeText from '../../../common/components/Widgets/LargeText';
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
    homes: HomeListStore.getState().items
  }

  componentDidMount() {
    HomeListStore.listen(this.storeListener);
    let filters = {type: this.props.params.mode || this.state.type};
    this.updateFilters(filters);
  }

  componentWillReceiveProps(props) {
    let type = props.params.mode || this.state.type || 'buy';
    this.setState({
      type: type
    });
    let filters = {type: type};
    this.updateFilters(filters);
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

  updateFilters(filters = {}) {
    debug('Filters', filters);
    HomeListStore.fetchItems(filters);
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
    let label = (this.state.type === 'buy') ? 'sale' : 'rent';
    setPageTitle(`Select homes for ${label} in London’s finest neighourhoods`);

    let placeholder = {
      url: 'https://res.cloudinary.com/homehapp/image/upload/v1439564093/london-view.jpg',
      alt: ''
    };

    return (
      <div id='propertyFilter'>
        <BigImage gradient='green' fixed image={placeholder} proportion={0.8}>
          <LargeText align='center' valign='middle' proportion={0.8}>
            <div className='splash'>
              <h1>Select homes for {label} in London’s finest neighourhoods</h1>
            </div>
          </LargeText>
        </BigImage>
        <HomeList items={homes} />
      </div>
    );
  }
}
