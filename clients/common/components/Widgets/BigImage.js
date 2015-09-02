'use strict';

import React from 'react';
import { setFullHeight } from '../../Helpers';
import classNames from 'classnames';
import Image from './Image';

class BigImage extends React.Component {
  static propTypes = {
    image: React.PropTypes.object.isRequired,
    fixed: React.PropTypes.bool,
    gradient: React.PropTypes.string,
    proportion: React.PropTypes.number,
    children: React.PropTypes.object
  };

  static defaultProps = {
    fixed: false,
    proportion: 1
  };

  componentDidMount() {
    setFullHeight();
  }

  render() {
    let classes = [
      'widget',
      'big-image',
      'full-height'
    ];

    if (this.props.fixed) {
      classes.push('fixed');
    }

    let image = this.props.image;

    return (
      <div className={classNames(classes)} data-gradient={this.props.gradient} data-proportion={this.props.proportion}>
        <div className='image-content'>
          <Image {...image} className='show-for-large' width={1920} mode='scale' />
          <Image {...image} className='show-for-medium' width={1000} mode='scale' />
          <Image {...image} className='show-for-small' height={600} mode='fill' />
        </div>
        <div className='image-text full-height' data-proportion={this.props.proportion}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default BigImage;
