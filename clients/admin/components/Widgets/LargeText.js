'use strict';

import BaseBlock from '../Widgets/BaseBlock';

export default class AdminLargeText extends BaseBlock {
  blockProperties = {
    content: {
      label: 'Content',
      type: 'textarea'
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
    proportion: {
      label: 'Proportion',
      type: 'text',
      defaultValue: 1
    },
    className: {
      label: 'CSS Classname',
      type: 'text'
    }
  }
}
