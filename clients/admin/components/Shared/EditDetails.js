'use strict';

import React from 'react';

export default class EditDetails extends React.Component {
  imageExists(url, stack) {
    debug('Check if image exists', stack);
    let found = false;
    stack.forEach((img) => {
      if (img.url === url) {
        debug('Image exists');
        found = true;
      }
    });
    debug('Image does not exist');
    return found;
  }

  addImage(imageData, stack) {
    debug('Add image', imageData);
    let isMaster = false;
    let homeImage = {
      url: imageData.url,
      width: imageData.width,
      height: imageData.height,
      isMaster: isMaster
    };

    if (!this.imageExists(homeImage.url, stack)) {
      debug('Add');
      stack.push(homeImage);
    }
  }

  addImages(uploads, stack) {
    for (let imageData of enumerate(uploads)) {
      this.addImage(imageData, stack);
    }
  }

  getSlug(object) {
    if (!object.slug) {
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
}
