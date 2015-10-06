'use strict';

import BaseBlock from '../Widgets/BaseBlock';

export default class AdminContentImage extends BaseBlock {
  blockProperties = {
    title: {
      label: 'Title',
      type: 'text'
    },
    description: {
      label: 'Description',
      type: 'textarea'
    },
    align: {
      label: 'Horizontal align',
      type: 'select',
      options: [
        ['left', 'Left'], ['right', 'Right']
      ]
    },
    image: {
      label: 'Image',
      type: 'image'
    }
  }
}
