'use strict';

import React from 'react';
import classNames from 'classnames';
import { merge } from '../../Helpers';
import DOMManipulator from '../../DOMManipulator';
import Loading from './Loading';

import { GoogleMap, Marker } from 'react-google-maps';

export default class Map extends React.Component {
  static propTypes = {
    center: React.PropTypes.array,
    label: React.PropTypes.string,
    zoom: React.PropTypes.number,
    markers: React.PropTypes.array,
    children: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ])
  };

  static defaultProps = {
    zoom: 10,
    markers: []
  };

  constructor() {
    super();
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize() {
    let container = new DOMManipulator(this.refs.map);
    let width = container.width();
    container.height(width);
  }

  // Get a plain arithmetic average for the center position for a set of
  // markers
  getCenter() {
    if (this.props.center) {
      return this.props.center;
    }

    let lat = 0;
    let lng = 0;

    // Show London if nothing else is available
    if (!this.props.markers || !this.props.markers.length) {
      return [51.5072, 0.1275];
    }

    for (let i = 0; i < this.props.markers.length; i++) {
      lat += this.props.markers.position.lat;
      lng += this.props.markers.position.lng;
    }

    return [lat / this.props.markers.length, lng / this.props.markers.length];
  }

  render() {
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
      return (<Loading />);
    }

    let classes = [
      'widget',
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

    let center = this.getCenter();

    let options = {
      defaultZoom: this.props.zoom,
      defaultCenter: {
        lat: center[0],
        lng: center[1]
      },
      options: opt,
      containerProps: merge(this.props, {
        style: {
          height: '100%'
        },
        options: opt
      })
    };

    return (
      <div className={classNames(classes)}>
        <div className='width-wrapper'>
          <div className='map-wrapper'>
            <GoogleMap {...options} ref='map'>
              {
                this.props.markers.map((marker, index) => {
                  return (
                    <Marker {...marker} key={index} />
                  );
                })
              }
            </GoogleMap>
          </div>
          <div className='aux-content'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
