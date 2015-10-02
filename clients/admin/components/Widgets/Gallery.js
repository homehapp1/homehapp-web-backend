'use strict';

// import React from 'react';
import BaseBlock from '../Widgets/BaseBlock';

export default class AdminGallery extends BaseBlock {
  blockProperties = {
    title: {
      label: 'Title',
      type: 'text'
    },
    images: {
      label: 'Gallery items',
      type: 'images',
      config: {
        acceptedMimes: 'image/*,video/*'
      }
    }
  }
}
