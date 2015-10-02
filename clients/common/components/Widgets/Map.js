'use strict';

import React from 'react';
import classNames from 'classnames';
import DOMManipulator from '../../DOMManipulator';

let debug = require('../../../common/debugger')('Map');

export default class Map extends React.Component {
  static propTypes = {
    center: React.PropTypes.array,
    label: React.PropTypes.string,
    zoom: React.PropTypes.number,
    markers: React.PropTypes.array,
    children: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]),
    context: React.PropTypes.object
  };

  static contextTypes = {
    router: React.PropTypes.func
  };

  static defaultProps = {
    zoom: 10,
    markers: []
  };

  constructor() {
    super();
    this.resize = this.resize.bind(this);
    this.initMaps = this.initMaps.bind(this);
  }

  componentDidMount() {
    this.resize();

    this.map = null;
    this.mapContainer = new DOMManipulator(this.refs.map);
    this.loadGoogleMaps();
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  loadGoogleMaps() {
    if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
      this.initMaps();
      return;
    }

    let s = document.createElement('script');
    // Homehapp Google API key
    let key = 'AIzaSyBYAiBim9caWJ5ShPMk0thHlgBqhBJurHQ';
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    s.addEventListener('load', this.initMaps);
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  initMaps() {
    if (this.map) {
      return null;
    }

    let center = this.getCenter();
    let options = {
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
      center: {
        lat: center[0],
        lng: center[1]
      },
      zoom: this.props.zoom,
      scrollWheel: false
    };

    this.map = new google.maps.Map(this.mapContainer.node, options);
    this.setMarkers(this.props.markers);
  }

  setMarkers(markers) {
    if (!markers.length) {
      return null;
    }

    let click = function() {
      if (this.href) {
        window.location.href = this.href;
      }
    };

    markers.map((markerData) => {
      if (!markerData.location || markerData.location.length < 2) {
        return null;
      }

      let marker = new google.maps.Marker({
        position: {
          lat: markerData.location[0],
          lng: markerData.location[1]
        },
        href: this.markerUrl(markerData),
        title: markerData.title || '',
        icon: this.getMarkerImage()
      });
      marker.setMap(this.map);
      marker.addListener('click', click);
    });
  }

  getMarkerImage() {
    let width = 46;
    let height = 63;

    return {
      url: 'https://res.cloudinary.com/homehapp/image/upload/v1443442957/site/images/icons/place-marker.svg',
      size: new google.maps.Size(width, height),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(width / 2, height)
    };
  }

  markerUrl(marker) {
    if (typeof marker.href === 'string') {
      return marker.href;
    }

    if (typeof marker.route === 'object') {
      let params = marker.route.params || {};
      return this.context.router.makeHref(marker.route.to, params);
    }

    return null;
  }

  resize() {
    let map = new DOMManipulator(this.refs.map);
    let content = new DOMManipulator(this.refs.content);
    let container = new DOMManipulator(this.refs.container);
    let width = Math.floor(container.parent().width());

    if (container.css('display') === 'table') {
      width = Math.floor(width / 2) - 60;
    }

    // Maximum size for the map
    let mapSize = 600;
    map.width(Math.min(mapSize, width));
    map.height(Math.min(mapSize, width));
    content.width(width);
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
    if (this.props.context && !this.context) {
      this.context = this.props.context;
    }

    let classes = [
      'widget',
      'map',
      'width-wrapper'
    ];

    return (
      <div className={classNames(classes)}>
        <div className='width-wrapper' ref='container'>
          <div className='map-content'>
            <div className='map-wrapper' ref='map'></div>
          </div>
          <div className='aux-content'>
            <div className='content-wrapper' ref='content'>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
