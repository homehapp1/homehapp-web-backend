'use strict';

import React from 'react';
import Input from 'react-bootstrap/lib/Input';
import { enumerate, createNotification } from '../../../common/Helpers';

let debug = require('../../../common/debugger')('EditDetails');
const countries = require('../../../common/lib/Countries').forSelect();

export default class EditDetails extends React.Component {
  state = {
    images: []
  }

  imageExists(url) {
    debug('Check if image exists', this.state.images);
    let found = false;
    this.state.images.forEach((img) => {
      if (img.url === url) {
        debug('Image exists');
        found = true;
      }
    });
    debug('Image does not exist');
    return found;
  }

  addImage(imageData) {
    debug('Add image', imageData);
    let isMaster = false;
    let image = {
      url: imageData.url,
      width: imageData.width,
      height: imageData.height,
      isMaster: isMaster
    };

    if (!this.imageExists(image.url, this.state.images)) {
      debug('Add', image);
      this.state.images.push(image);
    }
  }

  addImages() {
    debug('addImages', this.state.uploads);
    if (this.state.uploads) {
      if (this.state.uploads[this.imageUploaderInstanceId]) {
        let uploads = this.state.uploads[this.imageUploaderInstanceId];
        debug('uploads str', uploads);
        for (let [key, imageData] of enumerate(uploads)) {
          this.addImage(imageData);
        }
      }
    }
  }

  onImageUpload(data) {
    debug('onImageUpload', data);
    this.addImages();

    this.setState({
      images: this.state.images
    });
  }

  onRemoveImageClicked(index) {
    let newImages = [];
    this.state.images.forEach((item, idx) => {
      if (idx !== index) {
        newImages.push(item);
      }
    });
    this.setState({images: newImages});
  }

  getCoordinates() {
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

  getSlug(object) {
    if (object.slug) {
      return null;
    }

    return (
        <Input
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

  handlePendingState() {
    createNotification({
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
      message: this.state.error.message
    });
  }
}
