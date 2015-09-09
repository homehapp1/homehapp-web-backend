'use strict';

import React from 'react';
import BaseBlock from '../Widgets/BaseBlock';

export default class AdminContentBlock extends BaseBlock {
  blockProperties = {
    title: {
      label: 'Title',
      type: 'text'
    },
    content: {
      label: 'Content',
      type: 'textarea'
    }
  }
}
