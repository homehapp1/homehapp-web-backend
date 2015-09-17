/*eslint-env es6 */
'use strict';

import React from 'react';

// Internal components
import HomeListStore from '../../stores/HomeListStore';
import ErrorPage from '../../../common/components/Layout/ErrorPage';

// Property List
import PropertyList from '../Property/List';

// Story widgets
import BigImage from '../../../common/components/Widgets/BigImage';
import Icon from '../../../common/components/Widgets/Icon';
import LargeText from '../../../common/components/Widgets/LargeText';
import Loading from '../../../common/components/Widgets/Loading';

export default class NeighborhoodHomeFilter extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired,
    neighborhood: React.PropTypes.object //.isRequired
  };

  static defaultProps = {
    neighborhood: {
      slug: 'stjohnswood',
      title: 'St. John\'s Wood',
      city: {
        title: 'London',
        slug: 'london'
      },
      images: [
        { url: 'v10/contentMockup/DSCF9347.jpg', alt: '', aspectRatio: 0.9795 }
      ],
      description: 'St John\'s Wood is a district of north-west London, in the City of Westminster, and on the north-west side of Regent\'s Park. It is about 2.5 miles (4 km) north-west of Charing Cross. Once part of the Great Middlesex Forest, it was later owned by the Knights of St John of Jerusalem.\n\nIt is a very affluent neighbourhood, with the area postcode (NW8) ranked by Forbes magazine as the 5th most expensive postcode in London based on the average home price in 2007. According to a 2014 property agent survey, St. John\'s Wood residents pay the highest average rent in all of London.\n\nIn 2013, the price of housing in St John\'s Wood reached exceptional levels. Avenue Road had more than 10 large mansions/villas for sale. The most expensive had an asking price of £65 million, with the cheapest at £15 million. The remainder were around £25 mill.'
    }
  };

  state = {
    error: null,
    homes: HomeListStore.getState().homes
  }

  constructor() {
    super();
    this.storeListener = this.onChange.bind(this);
  }

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

    console.log('homes', this.state.homes);

    let neighborhood = this.props.neighborhood;
    let defaultImage = {
      src: 'images/content/content-placeholder.jpg',
      alt: ''
    };

    let image = neighborhood.images[0] || defaultImage;

    return (
      <div className='neighborhoods-home-filter'>
        <BigImage image={image} gradient='black' fixed={false} proportion={0.5}>
          <LargeText align='center' valign='middle' proportion={0.5}>
            <Icon type='marker' color='black' size='large' />
            <h1>{neighborhood.title}</h1>
            <p>Homes</p>
          </LargeText>
        </BigImage>
        <PropertyList items={this.state.homes} />
      </div>
    );
  }
}
