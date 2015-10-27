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

    blocks.push({
      template: 'Agents',
      properties: {
        agents: this.props.home.agents,
        home: this.props.home
      }
    });

    if (this.props.home.location.neighborhood) {
      blocks.push({
        template: 'Neighborhood',
        properties: this.props.home.location.neighborhood
      });
    }

    console.log('Render blocks', blocks, this.props.home);
    return (
      <div className='home-view'>
        <HomeNavigation home={this.props.home} />
        <StoryLayout blocks={blocks} />
      </div>
    );
  }
}
