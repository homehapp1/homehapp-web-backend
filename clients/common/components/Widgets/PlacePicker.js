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
    area: React.PropTypes.oneOfType([
      React.PropTypes.null,
      React.PropTypes.array
    ]),
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
    // debug('Set initial markers');
    this.setMarkers();
    this.setArea();
  }

  setMarkers() {
    let lat = this.props.lat || this.getCenter()[0];
    let lng = this.props.lng || this.getCenter()[1];
    debug('Set markers', lat, lng, this.props.lat, this.props.lng);

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
      this.props.onChange(event.latLng.lat(), event.latLng.lng());
    });
    google.maps.event.addListener(this.map, 'rightclick', (event) => {
      this.props.onChange(event.latLng.lat(), event.latLng.lng());
      this.marker.setPosition(event.latLng);
    });
  }

  setArea(area = null) {
    if (!area) {
      area = this.props.area;
    }

    if (!area || !Array.isArray(area) || !area.length) {
      return null;
    }

    // Delete the old map
    if (this.area) {
      this.area.setMap(null);
    }

    this.area = new google.maps.Polygon({
      paths: area,
      strokeColor: '#9dc1fd',
      fillColor: '#9dc1fd',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillOpacity: 0.2
    });
    this.area.setMap(this.map);
    this.fitToBounds(area);
  }

  fitToBounds(area) {
    if (!area || !Array.isArray(area) || !area.length) {
      debug('Cannot fit the area to bounds, no area provided');
      return false;
    }
    let bounds = new google.maps.LatLngBounds();
    for (let pos of area) {
      bounds.extend(new google.maps.LatLng(pos.lat, pos.lng));
    }
    this.map.fitBounds(bounds);
    return true;
  }

  resize() {
    debug('Window resized, hooray!');
  }

  getValue() {
    if (this.props.lat && this.props.lng) {
      return [this.props.lat, this.props.lng];
    }
    return null;
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
