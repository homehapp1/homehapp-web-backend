'use strict';

import React from 'react';

import HomeNavigation from './HomeNavigation';
import Story from '../../../common/components/Widgets/Story';
import { setPageTitle } from '../../../common/Helpers';

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
    let blocks = this.props.home.story.blocks;

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

    return (
      <div className='home-view'>
        <HomeNavigation home={this.props.home} />
        <Story blocks={blocks} />
      </div>
    );
  }
}
