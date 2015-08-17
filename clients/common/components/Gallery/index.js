'use strict';

import React from 'react';
import { linearPartition } from '../../../common/Helpers';

class Gallery extends React.Component {
  static propTypes = {
    children: React.PropTypes.array.isRequired
  }

  componentDidMount() {
    console.log('gallery mounted');
  }

  render() {
    return (
      <div className='gallery item full-height' rel='gallery'>
        {this.props.children}
      </div>
    );
  }
}

export default Gallery;
