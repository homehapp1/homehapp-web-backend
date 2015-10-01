'use strict';

import React from 'react';
import { Link } from 'react-router';

import NeighborhoodStoryContainer from './NeighborhoodStoryContainer';

// Import widgets
import BigImage from '../../../common/components/Widgets/BigImage';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Icon from '../../../common/components/Widgets/Icon';
import Gallery from '../../../common/components/Widgets/Gallery';
import LargeText from '../../../common/components/Widgets/LargeText';

import { setPageTitle } from '../../../common/Helpers';


let debug = require('../../../common/debugger')('NeighborhoodStory');

export default class NeighborhoodStory extends NeighborhoodStoryContainer {
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
    let homes = (this.state.neighborhood.homes.length) ? this.state.neighborhood.homes : [];

    if (!homes.length) {
      return null;
    }

    let markers = this.getMarkers(homes);

    return (
      <Map center={this.props.neighborhood.location.coordinates} markers={markers}>
        {
          homes.map((home, index) => {
            if (index >= 3) {
              return null;
            }
            let rooms = null;
            for (let i = 0; i < home.attributes.length; i++) {
              if (home.attributes[i].name === 'rooms') {
                rooms = (<li>{home.attributes[i].value} rooms</li>);
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

    let primaryImage = {
      src: 'images/content/london-view.jpg',
      alt: '',
      type: 'asset',
      applySize: false
    };

    if (typeof this.props.neighborhood.images[0] !== 'undefined') {
      primaryImage = this.props.neighborhood.images[0];
    }

    let secondaryImage = primaryImage;
    if (typeof this.props.neighborhood.images[1] !== 'undefined') {
      secondaryImage = this.props.neighborhood.images[1];
    }

    return (
      <div className='neighborhood-story'>
        <BigImage image={primaryImage} gradient='black' fixed={false}>
          <LargeText align='center' valign='middle'>
            <Icon type='marker' color='black' size='large' />
            <h1>{this.props.neighborhood.title}</h1>
          </LargeText>
        </BigImage>

        <ContentBlock className='with-gradient padded'>
          <blockquote>{this.props.neighborhood.description}</blockquote>
          <p className='call-to-action'>
            <Link className='button' to='neighborhoodViewHomes' params={{city: this.props.neighborhood.city.slug, neighborhood: this.props.neighborhood.slug}}>Show homes</Link>
          </p>
        </ContentBlock>

        <ContentBlock className='with-gradient'>
          <Gallery images={this.props.neighborhood.images} columns={5} imageWidth={300} fullscreen className='tight' />
        </ContentBlock>

        <BigImage image={secondaryImage} fixed={false}>
          <LargeText>
            <h2>Homes of {this.props.neighborhood.title}</h2>
          </LargeText>
        </BigImage>

        <Separator icon='apartment' />
        {this.getMap()}

        <ContentBlock align='center'>
          <Link className='button' to='neighborhoodViewHomes' params={{city: this.props.neighborhood.city.slug, neighborhood: this.props.neighborhood.slug}}>Show more homes</Link>
        </ContentBlock>
      </div>
    );
  }
}
