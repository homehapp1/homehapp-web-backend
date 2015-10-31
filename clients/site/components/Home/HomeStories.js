/*eslint-env es6 */
import React from 'react';

// Internal components
import HomeListStore from '../../stores/HomeListStore';
import ErrorPage from '../../../common/components/Layout/ErrorPage';

// Home List
import HomeList from './HomeList';

// Story widgets
import BigImage from '../../../common/components/Widgets/BigImage';
import LargeText from '../../../common/components/Widgets/LargeText';

import { setPageTitle } from '../../../common/Helpers';

let debug = require('debug')('HomeSearch');

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
    homes: HomeListStore.getState().homes
  }

  componentDidMount() {
    HomeListStore.listen(this.storeListener);
    debug('HomeListStore', HomeListStore);
    HomeListStore.fetchItems({story: true});
    setPageTitle(`Our home stories`);
  }

  componentWillUnmount() {
    HomeListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    this.setState({
      error: state.error,
      homes: state.homes
    });
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
      return handleErrorState();
    }

    let homes = this.state.homes || [];

    let placeholder = {
      url: 'https://res.cloudinary.com/homehapp/image/upload/v1439564093/london-view.jpg',
      alt: ''
    };

    return (
      <div id='propertyFilter'>
        <BigImage gradient='green' fixed image={placeholder} proportion={0.8}>
          <LargeText align='center' valign='middle' proportion={0.8}>
            <div className='splash'>
              <h1>Our home stories</h1>
            </div>
          </LargeText>
        </BigImage>
        <HomeList items={homes} />
      </div>
    );
  }
}
