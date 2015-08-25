'use strict';

import React from 'react';
import { setFullHeight } from '../../Helpers';
import classNames from 'classnames';
import Image from '../../../common/components/Widgets/Image';

class BigImage extends React.Component {
  static propTypes = {
    image: React.PropTypes.object.isRequired,
    fixed: React.PropTypes.bool,
    gradient: React.PropTypes.string,
    proportion: React.PropTypes.number,
    children: React.PropTypes.object
  };

  componentDidMount() {
    setFullHeight();
  }

  render() {
    let classes = [
      'item',
      'big-image',
      'full-height'
    ];

    if (this.props.fixed) {
      classes.push('fixed');
    }

    let image = this.props.image;
    let proportion = this.props.proportion || 1;

    return (
      <div className={classNames(classes)} data-gradient={this.props.gradient} data-proportion={proportion}>
        <div className='image-content'>
          <Image src={image.url} className='show-for-large' alt={image.alt} variant='large' />
          <Image src={image.url} className='show-for-medium' alt={image.alt} variant='medium' />
          <Image src={image.url} className='show-for-small' alt={image.alt} variant='small' />
        </div>
        <div className='width-wrapper full-height' data-proportion={proportion}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default BigImage;
