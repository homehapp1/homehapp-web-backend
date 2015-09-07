'use strict';

import React from 'react';
import { Link } from 'react-router';

import Story from '../../../common/components/Widgets/Story';

class HomeStory extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  render() {
    let blocks = this.props.home.story.blocks;
    blocks.push({
      template: 'Map',
      properties: {
        coordinates: this.props.home.location.coordinates,
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

    blocks.push({
      template: 'Agent',
      properties: {
        name: 'Arttu Manninen',
        title: 'Developer',
        phone: '+358505958435',
        email: 'arttu@kaktus.cc'
      }
    });

    console.log('story blocks', blocks);

    return (
      <Story blocks={blocks} />
    );
  }
}

export default HomeStory;
