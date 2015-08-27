'use strict';

import React from 'react';
import classNames from 'classnames';

class Map extends React.Component {
  static propTypes = {
    coordinates: React.PropTypes.array.isRequired,
    label: React.PropTypes.string,
    children: React.PropTypes.object
  };

  render() {
    let classes = [
      'item',
      'map'
    ];

    return (
      <div className={classNames(classes)}>
        <div className='width-wrapper'>
          <div className='map-wrapper'>
            <div className='map' ref='map'></div>
          </div>
          <div className='aux-content'>
            <h2>{this.label}</h2>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Map;
