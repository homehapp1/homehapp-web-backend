'use strict';

import React from 'react';
import { Link } from 'react-router';

// Import widgets
import BigImage from '../../../common/components/Widgets/BigImage';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Icon from '../../../common/components/Widgets/Icon';
import Map from '../../../common/components/Widgets/Map';
import Gallery from '../../../common/components/Widgets/Gallery';
import LargeText from '../../../common/components/Widgets/LargeText';
import Separator from '../../../common/components/Widgets/Separator';

import { setPageTitle } from '../../../common/Helpers';
let debug = require('../../../common/debugger')('NeighborhoodStory');

export default class NeighborhoodStory extends React.Component {
  static propTypes = {
    neighborhood: React.PropTypes.object.isRequired
  }

  componentDidMount() {
    setPageTitle(this.props.neighborhood.neighborhoodTitle);
  }

  componentWillUnmount() {
    setPageTitle();
  }

  getMarkers(homes) {
    let markers = [];

    for (let home of homes) {
      debug('Add', home.title, home);
      markers.push({
        location: home.location.coordinates,
        title: home.homeTitle,
        route: {
          to: 'home',
          params: {
            slug: home.slug
          }
        }
      });
    }

    return markers;
  }

  getMap() {
    let homes = (this.props.neighborhood.homes.length) ? this.props.neighborhood.homes : [];

    let markers = this.getMarkers(homes);
    console.log('markers', markers);
    debug('Homes', homes, this.props.neighborhood.location.coordinates);

    return (
      <Map center={this.props.neighborhood.location.coordinates} markers={markers}>
        {
          homes.map((home, index) => {
            if (index >= 3) {
              return null;
            }
            let rooms = null;
            for (let attribute of home.attributes) {
              if (attribute.name === 'rooms') {
                rooms = (<li>{attribute.value} rooms</li>);
              }
            }

            return (
              <div className='home' key={index}>
                <h3>
                  <Link to='home' params={{slug: home.slug}} className='ellipsis-overflow'>
                    {home.homeTitle}
                  </Link>
                </h3>
                <ul>
                  {rooms}
                  <li>{home.fomattedPrice}</li>
                </ul>
              </div>
            );
          })
        }
      </Map>
    );
  }

  render() {
    debug('got neighborhood', this.props.neighborhood);

    let secondaryImage = this.props.neighborhood.mainImage;
    if (typeof this.props.neighborhood.images[1] !== 'undefined') {
      secondaryImage = this.props.neighborhood.images[1];
    }

    return (
      <div className='neighborhood-story'>
        <BigImage image={this.props.neighborhood.mainImage} gradient='black'>
          <LargeText align='center' valign='middle'>
            <Icon type='marker' color='black' size='large' />
            <h1>{this.props.neighborhood.title}</h1>
          </LargeText>
        </BigImage>

        <ContentBlock className='with-gradient padded'>
          <blockquote>{this.props.neighborhood.description}</blockquote>
          <p className='call-to-action'>
            <Link className='button' to='neighborhoodViewHomes' params={{city: this.props.neighborhood.location.city.slug, neighborhood: this.props.neighborhood.slug}}>Show homes</Link>
          </p>
        </ContentBlock>

        <ContentBlock className='with-gradient'>
          <Gallery images={this.props.neighborhood.images} columns={5} imageWidth={300} fullscreen className='tight' />
        </ContentBlock>

        <BigImage image={secondaryImage}>
          <LargeText>
            <h2>Homes of {this.props.neighborhood.title}</h2>
          </LargeText>
        </BigImage>

        <Separator icon='apartment' />
        {this.getMap()}

        <ContentBlock align='center'>
          <Link className='button' to='neighborhoodViewHomes' params={{city: this.props.neighborhood.location.city.slug, neighborhood: this.props.neighborhood.slug}}>Show more homes</Link>
        </ContentBlock>
      </div>
    );
  }
}
