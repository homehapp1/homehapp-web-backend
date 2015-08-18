'use strict';

import React from 'react';
import ApplicationStore from '../../stores/ApplicationStore';

class BigImage extends React.Component {
  constructor() {
    super();
    this.config = ApplicationStore.getState().config;
  }

  static propTypes = {
    src: React.PropTypes.string,
    alt: React.PropTypes.string,
    fixed: React.PropTypes.boolean,
    gradient: React.PropTypes.string
  };

  render() {
    let classes = [
      'item',
      'big-image',
      'full-height'
    ];

    if (this.props.fixed) {
      classes.push('fixed');
    }

    let alt = this.props.alt || '';

    let images = {
      small: `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.small}/${this.props.src}`,
      medium: `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.medium}/${this.props.src}`,
      large: `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.large}/${this.props.src}`
    };

    return (
      <div className={classes.join(' ')} data-gradient={this.props.gradient}>
        <div className='image-content'>
          <img alt={alt} className='show-for-large' src={images.large} />
          <img alt={alt} className='show-for-medium' src={images.medium} />
          <img alt={alt} className='show-for-small' src={images.small} />
        </div>
        <div className='width-wrapper full-height'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default BigImage;
