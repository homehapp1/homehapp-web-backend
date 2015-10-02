'use strict';

import React from 'react';
import { Link } from 'react-router';

// Widgets
import BigImage from '../../../common/components/Widgets/BigImage';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Image from '../../../common/components/Widgets/Image';
import LargeText from '../../../common/components/Widgets/LargeText';
import Loading from '../../../common/components/Widgets/Loading';

import NeighborhoodListStore from '../../stores/NeighborhoodListStore';
import ErrorPage from '../../../common/components/Layout/ErrorPage';


import { setPageTitle } from '../../../common/Helpers';

export default class NeighborhoodsList extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    neighborhoods: NeighborhoodListStore.getState().neighborhoods
  };

  componentDidMount() {
    setPageTitle(`Neighbourhoods of ${this.city.substr(0, 1).toUpperCase()}${this.city.substr(1)}`);
    NeighborhoodListStore.listen(this.storeListener);
    NeighborhoodListStore.fetchNeighborhoods(this.city);
  }

  componentWillUnmount() {
    setPageTitle();
    NeighborhoodListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    this.setState(state);
  }

  handlePendingState() {
    return (
      <Loading>
        <p>Loading neighborhoods...</p>
      </Loading>
    );
  }

  handleErrorState() {
    let error = {
      title: 'Error loading neighborhoods!',
      message: this.state.error.message
    };

    return (
      <ErrorPage {...error} />
    );
  }

  render() {
    let image = {
      src: 'images/content/london-view.jpg',
      alt: 'London Cityscape',
      author: 'Steve Cadman',
      type: 'asset'
    };

    this.city = 'london';

    if (typeof this.props.params !== 'undefined' && typeof this.props.params.city !== 'undefined') {
      this.city = this.props.params.city;
    }

    if (this.state.error) {
      return this.handleErrorState();
    }

    if (NeighborhoodListStore.isLoading()) {
      return this.handlePendingState();
    }

    let neighborhoods = this.state.neighborhoods || [];

    return (
      <div className='neighborhood-list-container'>
        <BigImage image={image}>
          <LargeText align='center' valign='middle'>
            <h1>Neighbourhoods of London</h1>
          </LargeText>
        </BigImage>
        <ContentBlock className='neighborhoods-list'>
          {
            neighborhoods.map((neighborhood, index) => {
              let img = image;

              if (neighborhood.images && neighborhood.images.length) {
                img = neighborhood.images[0];
              }
              return (
                <div className='neighborhood' key={index}>
                  <Link className='image-wrapper' to='neighborhoodView' params={{city: neighborhood.location.city.slug, neighborhood: neighborhood.slug}}>
                    <Image {...img} width={1200} height={680} mode='fill' />
                  </Link>
                  <ContentBlock valign='center'>
                    <h2 className='block-title'>
                      <Link to='neighborhoodView' params={{city: neighborhood.location.city.slug, neighborhood: neighborhood.slug}}>
                        {neighborhood.title}
                      </Link>
                    </h2>
                    <ul className='buttons'>
                      <li>
                        <Link to='neighborhoodView' params={{city: neighborhood.location.city.slug, neighborhood: neighborhood.slug}}>
                          Read about
                        </Link>
                      </li>
                      <li>
                        <Link to='neighborhoodViewHomes' params={{city: neighborhood.location.city.slug, neighborhood: neighborhood.slug}}>
                          Show homes
                        </Link>
                      </li>
                    </ul>
                  </ContentBlock>
                </div>
              );
            })
          }
        </ContentBlock>
      </div>
    );
  }
}
