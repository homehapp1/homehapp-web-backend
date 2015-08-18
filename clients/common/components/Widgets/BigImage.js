'use strict';
import React from 'react';

class BigImage extends React.component {
  static propTypes = {
    src: React.PropTypes.string
  };

  render() {
    let classes = [
      'item',
      'big-image',
      'full-height'
    ];

    let images = {
      small: `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.small}/${this.props.src}`,
      medium: `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.medium}/${this.props.src}`,
      large: `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.large}/${this.props.src}`
    };

    return (
      <div className={classes.join(' ')}>
        <div className='image-content'>
          <img alt='Live your dream' className='parallax-move show-for-large' src={images.large} />
          <img alt='Live your dream' className='parallax-move show-for-medium' src={images.medium} />
          <img alt='Live your dream' className='parallax-move show-for-small' src={images.small} />
        </div>
        <div className='width-wrapper full-height'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
