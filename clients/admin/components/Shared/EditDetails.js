import React from 'react';
import InputWidget from '../Widgets/Input';
import { createNotification } from '../../../common/Helpers';

let debug = require('../../../common/debugger')('EditDetails');
const countries = require('../../../common/lib/Countries').forSelect();

export default class EditDetails extends React.Component {
  constructor(props) {
    super(props);
    this.saving = null;
  }

  state = {
    images: [],
    coordinates: []
  }

  imageExists(url, key) {
    debug('Check if image exists', this.state[key]);
    let found = false;
    this.state[key].forEach((img) => {
      if (img.url === url) {
        debug('Image exists');
        found = true;
      }
    });
    debug('Image does not exist');
    return found;
  }

  addImage(imageData, key) {
    debug('Add image', imageData, key);
    let isMaster = false;
    let image = {
      url: imageData.url,
      width: imageData.width,
      height: imageData.height,
      isMaster: isMaster
    };

    if (!this.imageExists(image.url, key)) {
      debug('Add', image);
      this.state[key].push(image);
    }
  }

  addImages(key) {
    debug('addImages', this.state.uploads, key);
    if (this.state.uploads) {
      if (this.state.uploads[key]) {
        let uploads = this.state.uploads[key];
        debug('uploads str', uploads, typeof uploads);
        for (let i in uploads) {
          this.addImage(uploads[i], key);
        }
      }
    }
  }

  onImageUpload(data, object, key = 'images') {
    debug('Arguments', arguments);
    if (typeof this.state[key] === 'undefined') {
      debug(`onImageUpload: There is no state "${key}"`, this.state);
      return null;
    }

    debug('onImageUpload', data);
    this.addImages(key);

    let state = {};
    state[key] = this.state[key];
    this.setState(state);
  }

  onRemoveImageClicked(index, key = 'images') {
    debug('onRemoveImageClicked args', arguments);
    if (typeof this.state[key] === 'undefined') {
      debug(`onRemoveImageClicked: There is no state "${key}"`, this.state);
      return null;
    }

    let newImages = [];
    this.state[key].forEach((item, idx) => {
      if (idx !== index) {
        newImages.push(item);
      }
    });
    let state = {};
    state[key] = newImages;
    this.setState(state);
  }

  getCoordinates() {
    if (this.state.lat && this.state.lng) {
      return [Number(this.state.lat), Number(this.state.lng)];
    }
    if (!this.refs.locationLatitude || !this.refs.locationLongitude) {
      return null;
    }

    let lat = this.refs.locationLatitude.getValue();
    let lng = this.refs.locationLongitude.getValue();

    if (!lat || !lng) {
      return null;
    }

    return [
      Number(lat),
      Number(lng)
    ];
  }

  setCoordinates(lat, lng) {
    debug('setCoordinates', lat, lng);
    for (let prop of this.props) {
      if (!prop || typeof prop.location === 'undefined' || typeof prop.location.coordinates === 'undefined') {
        continue;
      }

      debug('set to', prop);
      if (lat && lng) {
        prop.location.coordinates = [lat, lng];
      } else {
        prop.location.coordinates = null;
      }
    }
  }

  getSlug(object) {
    if (object.slug) {
      return null;
    }

    return (
        <InputWidget
        type='text'
        label='URL address'
        placeholder='URL address (will be generated)'
        readOnly
        defaultValue={object.slug}
      />
    );
  }

  getCountries() {
    return countries;
  }

  getCountryOptions() {
    return this.getCountries().map((country) => {
      return (
        <option
          value={country.value}
          key={'locCountry-' + country.value}>
          {country.label}
        </option>
      );
    });
  }

  setCoordinates(lat, lng) {
    debug('Callback:setCoordinates', lat, lng);
    this.setState({
      lat: lat,
      lng: lng
    });
  }

  setInitialLocation(location) {
    if (!location) {
      return debug('No location provided for the model');
    }
    if (!location.coordinates) {
      return debug('No coordinates were found from the location', location);
    }
    if (location.coordinates.length < 2) {
      return debug('Coordinate system failed the sanity check for location', location);
    }
    this.state.lat = location.coordinates[0];
    this.state.lng = location.coordinates[1];
  }

  handlePendingState() {
    debug('handlePendingState');
    this.saving = createNotification({
      message: 'Saving the data...'
    });
  }

  handleErrorState() {
    debug('handleErrorState');
    if (!typeof this.state.error === 'undefined' || !this.state.error) {
      return null;
    }
    createNotification({
      label: 'Error saving the object',
      message: this.state.error.message,
      type: 'danger'
    });
  }

  handleRenderState() {
    if (this.saving) {
      this.saving.close();
      this.saving = false;
    }
  }
}
