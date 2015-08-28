'use strict';

import React from 'react';
import { Link } from 'react-router';
import Story from '../../../common/components/Widgets/Story';

class HomeDetails extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  render() {
    let blocks = [];

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

    return (
      <Story blocks={blocks} />
    );
  }
}

export default HomeDetails;
