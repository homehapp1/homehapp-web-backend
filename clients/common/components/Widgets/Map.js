'use strict';

import React from 'react';
import classNames from 'classnames';
import { merge } from '../../Helpers';

import { GoogleMap, Marker } from 'react-google-maps';

class Map extends React.Component {
  static propTypes = {
    coordinates: React.PropTypes.array.isRequired,
    label: React.PropTypes.string,
    zoom: React.PropTypes.number,
    children: React.PropTypes.object
  };

  static defaultProps = {
    zoom: 10
  };

  componentDidMount() {
    console.log('this.refs.map', this.refs.map);
  }

  render() {
    let classes = [
      'item',
      'map'
    ];

    let opt = {
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.RIGHT_CENTER
      }
    };

    let options = {
      defaultZoom: this.props.zoom,
      defaultCenter: {
        lat: this.props.coordinates[0],
        lng: this.props.coordinates[1]
      },
      options: opt,
      containerProps: merge(this.props, {
        style: {
          height: '100%'
        },
        options: opt
      })
    };

    let markers = [
      {
        position: {
          lat: this.props.coordinates[0],
          lng: this.props.coordinates[1]
        }
      }
    ];

    return (
      <div className={classNames(classes)}>
        <div className='width-wrapper'>
          <div className='map-wrapper'>
            <GoogleMap {...options} ref='map'>
              {
                markers.map((marker, index) => {
                  return (
                    <Marker {...marker} key={index} />
                  );
                })
              }
            </GoogleMap>
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
