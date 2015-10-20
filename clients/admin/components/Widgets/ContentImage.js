import BaseBlock from '../Widgets/BaseBlock';

export default class AdminContentImage extends BaseBlock {
  blockProperties = {
    title: {
      label: 'Title (optional)',
      type: 'text'
    },
    description: {
      label: 'Content (optional)',
      type: 'textarea'
    },
    imageAlign: {
      label: 'On which side the image should be',
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
