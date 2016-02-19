// import React from 'react';
import BaseBlock from '../Widgets/BaseBlock';

export default class AdminHTML extends BaseBlock {
  blockProperties = {
    content: {
      label: 'HTML Content',
      type: 'textarea',
      required: true
    }
  }
}
