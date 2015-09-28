'use strict';

// import React from 'react';
import BaseBlock from '../Widgets/BaseBlock';

export default class AdminBigImage extends BaseBlock {
  blockProperties = {
    title: {
      label: 'Title',
      type: 'text'
    },
    description: {
      label: 'Description',
      type: 'textarea'
    },
    fixed: {
      label: 'Fixed',
      type: 'checkbox'
    },
    align: {
      label: 'Horizontal align',
      type: 'select',
      options: [
        ['left', 'Left'], ['center', 'Center'], ['right', 'Right']
      ]
    },
    valign: {
      label: 'Vertical align',
      type: 'select',
      options: [
        ['top', 'Top'], ['middle', 'Middle'], ['bottom', 'Bottom']
      ]
    },
    image: {
      label: 'Image',
      type: 'image'
    }
  }
}
