'use strict';

import React from 'react';
import Columns from './Columns';
import ContentBlock from './ContentBlock';
import Image from './Image';

class ContentImage extends React.Component {
  static propTypes = {
    image: React.PropTypes.object.isRequired,
    imageAlign: React.PropTypes.string,
    children: React.PropTypes.oneOf([
      React.PropTypes.object,
      React.PropTypes.array
    ])
  };

  static defaultProps = {
    imageAlign: 'left'
  };

  render() {
    let left = null;
    let right = null;
    let classes = [
      'content-image'
    ];

    let variant = 'half';
    let content = this.props.children;

    // Verify that there is any content
    if (Array.isArray(content)) {
      let hasContent = false;
      for (let i = 0; i < content.length; i++) {
        if (content[i]) {
          hasContent = true;
          break;
        }
      }

      if (!hasContent) {
        content = null;
        variant = 'full';
      }
    }
    // Create the image block, all the data for its creation is now available
    let image = (<Image {...this.props.image} variant={variant} />);

    // If there is no content, display larger image in the center
    if (!content) {
      classes.push('no-content');
      return (
        <ContentBlock className={classes.join(' ')}>
          Centered
          {image}
        </ContentBlock>
      );
    }

    // Determine the content locations
    if (this.props.imageAlign === 'left') {
      left = image;
      right = this.props.children;
      classes.push('image-left content-right');
    } else {
      left = this.props.children;
      right = image;
      classes.push('image-right content-left');
    }

    return (
      <ContentBlock className={classes.join(' ')}>
        Classes: {classes.join(' ')}
        <Columns cols={2}>
          {left}
          {right}
        </Columns>
      </ContentBlock>
    );
  }
}

export default ContentImage;
