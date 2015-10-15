'use strict';

import React from 'react';
import Map from './Map';
let debug = require('debug')('PlacePicker');

export default class PlacePicker extends Map {
  static propTypes = {
    lat: React.PropTypes.oneOfType([
      React.PropTypes.null,
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    lng: React.PropTypes.oneOfType([
      React.PropTypes.null,
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    onChange: React.PropTypes.func,
    zoom: React.PropTypes.number,
    markers: React.PropTypes.oneOfType([
      React.PropTypes.null,
      React.PropTypes.array
    ])
  }

  static defaultProps = {
    lat: null,
    lng: null,
    zoom: 10,
    markers: [],
    onChange: function() {
      debug('Default onChange');
    }
  }

  setInitialMarkers() {
    debug('Set initial markers');
    this.setMarkers();
  }

  setMarkers() {
    let lat = this.props.lat || this.getCenter()[0];
    let lng = this.props.lng || this.getCenter()[1];
    console.log('Set markers', lat, lng, this.props.lat, this.props.lng);

    if (this.marker) {
      let latLng = new google.maps.LatLng(lat, lng);
      this.marker.setPosition(latLng);
      this.map.panTo(latLng);
    }

    this.marker = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lng
      },
      icon: this.getMarkerImage(),
      draggable: true
    });
    this.marker.setMap(this.map);
    google.maps.event.addListener(this.marker, 'dragend', (event) => {
      debug('Drag end', event);
      this.props.onChange(event.latLng.lat(), event.latLng.lng());
    });
  }

  resize() {
    debug('Window resized, hooray!');
  }

  render() {
    return (
      <div className='place-picker'>
        <div className='map' ref='map' style={{height: '500px', border: 'solid 2px #468cc8'}}>
          Map loading...
        </div>
      </div>
    );
  }
}
