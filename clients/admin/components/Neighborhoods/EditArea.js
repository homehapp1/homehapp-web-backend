import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Well from 'react-bootstrap/lib/Well';

import NeighborhoodStore from '../../stores/NeighborhoodStore';
import NeighborhoodActions from '../../actions/NeighborhoodActions';

import InputWidget from '../Widgets/Input';
import { createNotification, merge } from '../../../common/Helpers';

let debug = require('../../../common/debugger')('NeighborhoodsEditArea');
// const countries = require('../../../common/lib/Countries').forSelect();

export default class NeighborhoodsEditArea extends React.Component {
  static propTypes = {
    neighborhood: React.PropTypes.object.isRequired,
    zoom: React.PropTypes.number,
    minZoom: React.PropTypes.number,
    maxZoom: React.PropTypes.number
  }

  static defaultProps = {
    zoom: 10,
    minZoom: 6,
    maxZoom: 20,
    markers: [],
    className: null
  };

  constructor(props) {
    super(props);
    this.storeListener = this.onNeighborhoodStoreChange.bind(this);
  }

  state = {
    neighborhood: null
  }

  componentDidMount() {
    NeighborhoodStore.listen(this.storeListener);

    this.map = null;
    this.mapContainer = React.findDOMNode(this.refs.map);
    this.coords = this.props.neighborhood.area;
    this.polygon = null;
    this.initMap();
  }

  componentWillUnmount() {
    NeighborhoodStore.unlisten(this.storeListener);
  }

  onNeighborhoodStoreChange(state) {
    debug('onNeighborhoodStoreChange', state);
    this.setState(state);
  }

  getCenter() {
    let defaultCenter = [51.5072, 0.1275];

    if (!this.neighborhood.location.coords || !this.neighborhood.location.coords[0] || !this.neighborhood.location.coords[1]) {
      return defaultCenter;
    }

    return this.neighborhood.location.coords;
  }

  initMap() {
    debug('initMap');
    if (this.map) {
      return null;
    }

    if (!this.mapContainer) {
      console.error('No map container available');
      return false;
    }
    debug('Map container', this.mapContainer);

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
      minZoom: this.props.minZoom,
      maxZoom: this.props.maxZoom,
      scrollWheel: false
    };

    this.map = new google.maps.Map(this.mapContainer, options);
    this.drawPolygon();
  }

  onChange() {
    debug('onChange');
    try {
      let value = this.refs.coords.getValue();

      if (!value) {
        this.neighborhood.area = [];
        createNotification({
          duration: 5,
          message: 'Warning: an empty area defined'
        });
        return null;
      }

      let json = JSON.parse(value);
      if (!json) {
        throw new Error('Failed to parse JSON');
      }
      // First type check to the JSON: it has to be an array
      if (!Array.isArray(json)) {
        throw new Error('Only array input is valid');
      }

      // Validate each item of the JSON
      for (let pos of json) {
        if (typeof pos.lat === 'undefined' || typeof pos.lng === 'undefined') {
          throw new Error(`Position ${JSON.stringify(pos)} did not contain the required keys lat and lng`);
        }
      }
      debug('Got neighborhood polygon', json);
      this.neighborhood.area = json;
      this.drawPolygon();
    } catch (error) {
      createNotification({
        duration: 5,
        message: error.toString(),
        type: 'danger'
      });
      return false;
    }
    return true;
  }

  onSave(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.onChange()) {
      return false;
    }

    let props = {
      id: this.neighborhood.id,
      area: this.neighborhood.area
    };
    console.log('update with', props);
    NeighborhoodActions.updateItem(props);
  }

  drawPolygon() {
    // Destroy the old polygon if available
    if (this.polygon) {
      this.polygon.setMap(null);
    }

    if (!this.neighborhood.area || !this.neighborhood.area.length) {
      return null;
    }

    this.polygon = new google.maps.Polygon({
      paths: this.neighborhood.area,
      strokeColor: '#ff0000',
      fillColor: '#ff0000',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillOpacity: 0.4
    });
    this.polygon.setMap(this.map);
  }

  updateMap() {
    debug('Update map');
    if (this.map) {
      setTimeout(() => {
        google.maps.event.trigger(this.map, 'resize');
        let center = this.getCenter();
        this.map.setCenter({lat: center[0], lng: center[1]});
      }, 100);
    }
  }

  render() {
    this.neighborhood = this.state.neighborhood || this.props.neighborhood;
    let coords = this.neighborhood.area || [];
    debug('Use coords', coords);

    return (
      <Row>
        <form name='neighborhoodDetails' ref='neighborhoodDetailsForm' method='POST'>
          <Col md={10} sm={10}>
            <Panel header='Area'>
              <div className='map area-display' ref='map' style={{height: '500px'}} />
              <InputWidget
                type='textarea'
                ref='coords'
                onBlur={this.onChange.bind(this)}
                defaultValue={JSON.stringify(coords)}
                />
            </Panel>
            <Well>
              <Row>
                <Col md={6}>
                  <Button bsStyle='success' accessKey='s' onClick={this.onSave.bind(this)}>Save</Button>
                </Col>
              </Row>
            </Well>
          </Col>
        </form>
      </Row>
    );
  }
}
