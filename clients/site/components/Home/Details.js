'use strict';

import React from 'react';
import { Link } from 'react-router';
import Story from '../../../common/components/Widgets/Story';

class HomeDetails extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  render() {
    console.log('home', this.props.home);
    return (
      <Story blocks={this.props.home.story.blocks} />
    );
  }
}

export default HomeDetails;
