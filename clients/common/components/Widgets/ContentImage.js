import React from 'react';
import BaseWidget from './BaseWidget';
import Columns from './Columns';
import ContentBlock from './ContentBlock';
import Image from './Image';

export default class ContentImage extends BaseWidget {
  static propTypes = {
    image: React.PropTypes.object.isRequired,
    imageAlign: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.null,
      React.PropTypes.object,
      React.PropTypes.array
    ]),
    className: React.PropTypes.string
  };

  static defaultProps = {
    imageAlign: 'left'
  };

  static validate(props) {
    Image.validate(props.image);

    if (['left', 'right'].indexOf(props.imageAlign) === -1) {
      throw new Error('Attribute "imageAlign" has to be either "left" or "right"');
    }

    return true;
  }

  renderWidget() {
    let left = null;
    let right = null;
    let classes = [
      'content-image',
      'with-gradient'
    ];

    let variant = 'half';
    let content = (<div className='description'>{this.props.children}</div>);

    // Verify that there is any content
    if (Array.isArray(this.props.children)) {
      let hasContent = false;
      for (let i = 0; i < this.props.children.length; i++) {
        if (this.props.children[i]) {
          hasContent = true;
          break;
        }
      }

      if (!hasContent) {
        content = null;
        variant = 'full';
      }
    }

    let img = {
      url: this.props.image.url,
      alt: this.props.image.alt,
      aspectRatio: this.props.image.aspectRatio
    };
    // Create the image block, all the data for its creation is now available
    let image = (<Image {...img} variant={variant} />);

    // If there is no content, display larger image in the center
    if (!content) {
      classes.push('no-content');
      return (
        <ContentBlock className={classes.join(' ')}>
          {image}
        </ContentBlock>
      );
    }

    if (this.props.className) {
      classes.push(this.props.className);
    }

    // Determine the content locations
    if (this.props.imageAlign === 'left') {
      left = image;
      right = content;
      classes.push('image-left content-right');
    } else {
      left = content;
      right = image;
      classes.push('image-right content-left');
    }

    return (
      <ContentBlock className={classes.join(' ')}>
        <Columns cols={2} className='table' valign='middle'>
          {left}
          {right}
        </Columns>
      </ContentBlock>
    );
  }
}
