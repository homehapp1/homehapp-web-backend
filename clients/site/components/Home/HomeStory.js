'use strict';

import React from 'react';

import HomeNavigation from './HomeNavigation';
import HomeContainer from './HomeContainer';
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
    console.log('got home', this.props.home.location.neighborhood);
    let blocks = this.props.home.story.blocks;
    blocks.push({
      template: 'Map',
      properties: {
        center: this.props.home.location.coordinates,
        markers: [{
          location: this.props.home.location.coordinates,
          title: this.props.home.homeTitle
        }],
        label: 'Lorem ipsum',
        content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit. Sed augue orci, lacinia eu tincidunt et eleifend nec lacus.'
      }
    });

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