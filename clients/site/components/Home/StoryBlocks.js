import React from 'react';
import { Link } from 'react-router';
import { merge } from '../../../common/Helpers';
let debug = require('debug')('StoryBlocks');

export default class StoryBlocks extends React.Component {
  static propTypes = {
    context: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.func
  }

  addViewControls(home) {
    if (!home.story.enabled) {
      return null;
    }

    let storyUrl = this.context.router.makeHref('home', {slug: home.slug});
    let detailsUrl = this.context.router.makeHref('homeDetails', {slug: home.slug});
    let neighborhood = null;

    if (home.location && home.location.neighborhood) {
      debug('home.location.neighborhood.city', home.location.neighborhood);
      neighborhood = (
        <li>
          <Link to='neighborhoodView' params={{
            city: home.location.neighborhood.location.city.slug,
            neighborhood: home.location.neighborhood.slug}
          }>
            Neighborhood
          </Link>
        </li>
      );
    }

    return (
      <ul className='home-links'>
        <li className={(storyUrl === window.location.pathname) ? 'active' : ''}>
          <a href={storyUrl}>
            Story
          </a>
        </li>
        <li className={(detailsUrl === window.location.pathname) ? 'active' : ''}>
          <a href={detailsUrl}>
            Info
          </a>
        </li>
        {neighborhood}
      </ul>
    );
  }

  prependBlocks(existingBlocks, home) {
    let blocks = [];

    if (!existingBlocks[0] || ['BigVideo', 'BigImage'].indexOf(existingBlocks[0].template) === -1) {
      blocks.push({
        template: 'BigImage',
        properties: {
          title: home.homeTitle,
          image: merge({}, home.mainImage)
        }
      });
    }

    blocks = blocks.concat(existingBlocks);
    blocks[0].properties.secondary = this.addViewControls(home);
    return blocks;
  }

  appendBlocks(blocks) {
    blocks = blocks || [];

    // Add location
    if (this.props.home.location.coordinates && this.props.home.location.coordinates[0] && this.props.home.location.coordinates[1]) {
      blocks.push({
        template: 'Map',
        properties: {
          center: this.props.home.location.coordinates,
          zoom: 12,
          markers: [{
            location: this.props.home.location.coordinates,
            title: this.props.home.homeTitle
          }]
        }
      });
    }

    // Add agents block
    blocks.push({
      template: 'Separator',
      properties: {
        icon: 'marker'
      }
    });
    blocks.push({
      template: 'Agents',
      properties: {
        agents: this.props.home.agents,
        home: this.props.home
      }
    });

    // Add neighborhood block
    if (this.props.home.location.neighborhood) {
      blocks.push({
        template: 'Separator',
        properties: {}
      });

      blocks.push({
        template: 'Neighborhood',
        properties: this.props.home.location.neighborhood
      });
    }
    return blocks;
  }
}
