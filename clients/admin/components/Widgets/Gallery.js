'use strict';

// import React from 'react';
import BaseBlock from '../Widgets/BaseBlock';
import { merge } from '../../../common/Helpers';

// let debug = require('../../../common/debugger')('AdminGallery');

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

  getProps() {
    let props = merge({}, this.props);
    delete props.parent;
    return props;
  }
}
