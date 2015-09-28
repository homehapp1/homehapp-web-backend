'use strict';

import React from 'react';
import { Link } from 'react-router';

// Widgets
import Gallery from '../../../common/components/Widgets/Gallery';
import BigImage from '../../../common/components/Widgets/BigImage';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Icon from '../../../common/components/Widgets/Icon';
import LargeText from '../../../common/components/Widgets/LargeText';
import Map from '../../../common/components/Widgets/Map';
import Separator from '../../../common/components/Widgets/Separator';

// Layouts
import Loading from '../../../common/components/Widgets/Loading';
import ErrorPage from '../../../common/components/Layout/ErrorPage';

// Stores
import HomeListStore from '../../stores/HomeListStore';

import { setPageTitle } from '../../../common/Helpers';

export default class NeighborhoodsStory extends React.Component {
  static propTypes = {
    params: React.PropTypes.object,
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
      location: {
        'coordinates': [51.5072, 0.1275]
      },
      images: [
        { url: 'v10/contentMockup/DSCF9306.jpg', alt: '', aspectRatio: 1.5179 },
        { url: 'v10/contentMockup/DSCF9257.jpg', alt: '', aspectRatio: 1.1567 },
        { url: 'v10/contentMockup/DSCF9261.jpg', alt: '', aspectRatio: 0.8682 },
        { url: 'v10/contentMockup/DSCF9280.jpg', alt: '', aspectRatio: 1.5 },
        { url: 'v10/contentMockup/DSCF9283.jpg', alt: '', aspectRatio: 1.4998 },
        { url: 'v10/contentMockup/DSCF9287.jpg', alt: '', aspectRatio: 1.1859 },
        // { url: 'v10/contentMockup/DSCF9293.jpg', alt: '', aspectRatio: 1.5401 },
        // { url: 'v10/contentMockup/DSCF9301.jpg', alt: '', aspectRatio: 0.9691 },
        // { url: 'v10/contentMockup/DSCF9307.jpg', alt: '', aspectRatio: 1.3606 },
        // { url: 'v10/contentMockup/DSCF9310.jpg', alt: '', aspectRatio: 1.4556 },
        // { url: 'v10/contentMockup/DSCF9328.jpg', alt: '', aspectRatio: 1.6685 },
        // { url: 'v10/contentMockup/DSCF9330.jpg', alt: '', aspectRatio: 1.5797 },
        // { url: 'v10/contentMockup/DSCF9332.jpg', alt: '', aspectRatio: 1.8638 },
        // { url: 'v10/contentMockup/DSCF9339.jpg', alt: '', aspectRatio: 1.2735 },
        { url: 'v10/contentMockup/DSCF9347.jpg', alt: '', aspectRatio: 0.9795 }
      ],
      description: 'St John\'s Wood is a district of north-west London, in the City of Westminster, and on the north-west side of Regent\'s Park. It is about 2.5 miles (4 km) north-west of Charing Cross. Once part of the Great Middlesex Forest, it was later owned by the Knights of St John of Jerusalem.\n\nIt is a very affluent neighbourhood, with the area postcode (NW8) ranked by Forbes magazine as the 5th most expensive postcode in London based on the average home price in 2007. According to a 2014 property agent survey, St. John\'s Wood residents pay the highest average rent in all of London.\n\nIn 2013, the price of housing in St John\'s Wood reached exceptional levels. Avenue Road had more than 10 large mansions/villas for sale. The most expensive had an asking price of £65 million, with the cheapest at £15 million. The remainder were around £25 mill.'
    }
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
    setPageTitle(`${this.props.neighborhood.title} | Neighbourhoods of ${this.props.neighborhood.city.title}`);

    HomeListStore.listen(this.storeListener);
    HomeListStore.fetchHomes({limit: 5});
  }

  componentWillUnmount() {
    HomeListStore.unlisten(this.storeListener);
    setPageTitle();
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

  getMarkers(homes) {
    let markers = [];

    for (let i = 0; i < homes.length; i++) {
      if (!Array.isArray(homes[i].location.coordinates)) {
        continue;
      }
      markers.push({
        location: homes[i].location.coordinates,
        title: homes[i].homeTitle,
        route: {
          to: 'home',
          params: {
            slug: homes[i].slug
          }
        }
      });
    }

    return markers;
  }

  getMap() {
    let homes = (this.state.homes) ? this.state.homes : [];

    if (!homes.length) {
      return (
        <ContentBlock>
          <h2>Homes</h2>
          <p>No homes</p>
          <h2>/Homes</h2>
        </ContentBlock>
      );
    }
    let markers = this.getMarkers(homes);

    return (
      <Map center={this.neighborhood.location.coordinates} markers={markers}>
        {
          homes.map((home, index) => {
            if (index >= 3) {
              return null;
            }

            return (
              <div className='home' key={index}>
                <h3>
                  <Link to='home' params={{slug: home.slug}} className='ellipsis-overflow'>
                    {home.homeTitle}
                  </Link>
                </h3>
                <ul>
                  <li>3 bedrooms</li>
                  <li>{home.fomattedPrice}</li>
                  <li>3 bedrooms</li>
                </ul>
              </div>
            );
          })
        }
      </Map>
    );
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }

    if (HomeListStore.isLoading()) {
      return this.handlePendingState();
    }

    this.neighborhood = this.props.neighborhood;

    let primaryImage = {
      src: 'images/content/london-view.jpg',
      alt: '',
      type: 'asset',
      applySize: false
    };

    if (typeof this.neighborhood.images[0] !== 'undefined') {
      primaryImage = this.neighborhood.images[0];
    }

    let secondaryImage = primaryImage;
    if (typeof this.neighborhood.images[1] !== 'undefined') {
      secondaryImage = this.neighborhood.images[1];
    }

    return (
      <div className='neighborhood-story'>
        <BigImage image={primaryImage} gradient='black' fixed={false}>
          <LargeText align='center' valign='middle'>
            <Icon type='marker' color='black' size='large' />
            <h1>{this.neighborhood.title}</h1>
          </LargeText>
        </BigImage>

        <ContentBlock className='with-gradient padded'>
          <blockquote>{this.neighborhood.description}</blockquote>
          <p className='call-to-action'>
            <Link className='button' to='neighborhoodsViewHomes' params={{city: this.neighborhood.city.slug, neighborhood: this.neighborhood.slug}}>Show homes</Link>
          </p>
        </ContentBlock>

        <ContentBlock className='with-gradient'>
          <Gallery images={this.neighborhood.images} columns={5} imageWidth={300} fullscreen className='tight' />
        </ContentBlock>

        <BigImage image={secondaryImage} fixed={false}>
          <LargeText>
            <h2>Homes of {this.neighborhood.title}</h2>
          </LargeText>
        </BigImage>

        <Separator icon='apartment' />
        {this.getMap()}

        <ContentBlock align='center'>
          <Link className='button' to='neighborhoodsViewHomes' params={{city: this.neighborhood.city.slug, neighborhood: this.neighborhood.slug}}>Show more homes</Link>
        </ContentBlock>
      </div>
    );
  }
}
