import React from 'react';
import { Link } from 'react-router';

// Import widgets
import BigImage from '../../../common/components/Widgets/BigImage';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import LargeText from '../../../common/components/Widgets/LargeText';
import Map from '../../../common/components/Widgets/Map';
import Separator from '../../../common/components/Widgets/Separator';
import StoryLayout from '../../../common/components/Layout/StoryLayout';

import { setPageTitle, merge } from '../../../common/Helpers';
let debug = require('../../../common/debugger')('NeighborhoodStory');

export default class NeighborhoodStory extends React.Component {
  static propTypes = {
    neighborhood: React.PropTypes.object.isRequired
  }

  componentDidMount() {
    if (this.props.neighborhood) {
      setPageTitle(this.props.neighborhood.pageTitle);
    }
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
    debug('Set markers', markers);
    debug('Homes', homes, this.props.neighborhood.location.coordinates);

    if (!homes.length) {
      return (
        <Map center={this.props.neighborhood.location.coordinates} markers={markers} />
      );
    }

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

  getBlocks() {
    let blocks = [];
    let primaryImage = merge({}, this.props.neighborhood.mainImage);

    if (this.props.neighborhood.story && this.props.neighborhood.story.blocks.length) {
      debug('this.props.neighborhood.story.blocks', this.props.neighborhood.story.blocks);
      blocks = [].concat(this.props.neighborhood.story.blocks);
    } else {
      blocks.push({
        template: 'BigImage',
        properties: {
          image: primaryImage,
          title: this.props.neighborhood.title,
          marker: {
            type: 'marker',
            color: 'black',
            size: 'large'
          }
        }
      });
      if (this.props.neighborhood.images.length > 1) {
        blocks.push({
          template: 'Gallery',
          properties: {
            images: this.props.neighborhood.images
          }
        });
      }
      if (this.props.neighborhood.description) {
        blocks.push({
          template: 'ContentBlock',
          properties: {
            content: this.props.neighborhood.description
          }
        });
      }
    }
    debug('Use blocks', blocks);
    return blocks;
  }

  renderHomeBlocks() {
    if (!this.props.neighborhood.homes || !this.props.neighborhood.homes.length) {
      return this.getMap();
    }

    return (
      <div class='neighborhood-home-blocks'>
        <ContentBlock className='with-gradient padded'>
          <p className='call-to-action'>
            <Link className='button' to='neighborhoodViewHomes' params={{city: this.props.neighborhood.location.city.slug, neighborhood: this.props.neighborhood.slug}}>Show homes</Link>
          </p>
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

  render() {
    debug('got neighborhood', this.props.neighborhood);

    let blocks = this.getBlocks();
    let secondaryImage = merge({}, this.props.neighborhood.mainImage);
    if (typeof this.props.neighborhood.images[1] !== 'undefined') {
      secondaryImage = this.props.neighborhood.images[1];
    }

    return (
      <div className='neighborhood-story'>
        <StoryLayout blocks={blocks} />
        {this.renderHomeBlocks()}
      </div>
    );
  }
}
