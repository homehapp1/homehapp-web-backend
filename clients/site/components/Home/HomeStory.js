'use strict';

import React from 'react';

import HomeNavigation from './HomeNavigation';
import StoryLayout from '../../../common/components/Layout/StoryLayout';
import { setPageTitle } from '../../../common/Helpers';

let debug = require('debug')('HomeStory');

export default class HomeStory extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  componentDidMount() {
    setPageTitle(this.props.home.homeTitle);
  }

  componentWillUnmount() {
    setPageTitle();
  }

  render() {
    // Create a copy of the blocks array
    let blocks = [].concat(this.props.home.story.blocks);

    if (this.props.home.location.coordinates[0] && this.props.home.location.coordinates[1]) {
      blocks.push({
        template: 'Map',
        properties: {
          center: this.props.home.location.coordinates,
          markers: [{
            location: this.props.home.location.coordinates,
            title: this.props.home.homeTitle
          }],
          label: 'Lorem ipsum',
          content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
        }
      });
    }

    if (this.props.home.location.neighborhood) {
      blocks.push({
        template: 'Neighborhood',
        properties: this.props.home.location.neighborhood
      });
    }

    // blocks.push({
    //   template: 'Agent',
    //   properties: {
    //     name: 'Arttu Manninen',
    //     title: 'Developer',
    //     phone: '+358505958435',
    //     email: 'arttu@kaktus.cc'
    //   }
    // });
    debug('Render blocks', blocks);
    console.log('Render blocks', blocks, this.props.home);
    return (
      <div className='home-view'>
        <HomeNavigation home={this.props.home} />
        <StoryLayout blocks={blocks} />
      </div>
    );
  }
}
