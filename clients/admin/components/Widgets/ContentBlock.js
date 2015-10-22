// import React from 'react';
import BaseBlock from '../Widgets/BaseBlock';

export default class AdminContentBlock extends BaseBlock {
  blockProperties = {
    title: {
      label: 'Title (optional)',
      type: 'text',
      required: false
    },
    content: {
      label: 'Content',
      type: 'textarea',
      required: true
    },
    align: {
      label: 'Alignment',
      type: 'select',
      options: [
        ['left', 'Left'], ['center', 'Center'], ['right', 'Right']
      ]
    }
  }
}
