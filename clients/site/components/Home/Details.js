'use strict';

import React from 'react';
import { Link } from 'react-router';
import Story from '../../../common/components/Widgets/Story';

class HomeDetails extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  render() {
    let blocks = this.props.home.story.blocks;
    blocks.push({
      template: 'Map',
      properties: {
        coordinates: this.props.home.location.coordinates
      }
    });

    if (this.props.home.location.neighborhood) {
      blocks.push({
        template: 'Neighborhood',
        properties: {
          title: this.props.home.location.neighborhood
        }
      });
    }

    blocks.push({
      template: 'Agent',
      properties: {
        name: 'Arttu Manninen',
        title: 'L`ombra dell`estate passata',
        phone: '+358505958435',
        email: 'arttu@kaktus.cc'
      }
    });

    return (
      <Story blocks={blocks} />
    );
  }
}

export default HomeDetails;
