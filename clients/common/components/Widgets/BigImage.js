'use strict';

import React from 'react';
import { merge } from '../../Helpers';
import classNames from 'classnames';
import Image from './Image';
import BigBlock from './BigBlock';

export default class BigImage extends BigBlock {
  static propTypes = {
    image: React.PropTypes.object.isRequired,
    fixed: React.PropTypes.bool,
    gradient: React.PropTypes.string,
    proportion: React.PropTypes.number,
    children: React.PropTypes.object,
    align: React.PropTypes.string,
    valign: React.PropTypes.string
  };

  static defaultProps = {
    fixed: false,
    proportion: 0,
    align: 'center',
    valign: 'middle'
  };

  render() {
    let classes = [
      'widget',
      'big-image',
      'full-height'
    ];

    let textProps = {};

    if (this.props.fixed) {
      classes.push('fixed');
    }

    let image = merge({}, this.props.image);
    image.mode = 'fill';

    let props = {
      className: classNames(classes),
      'data-gradient': this.props.gradient,
      'data-align': this.props.align,
      'data-valign': this.props.valign
    };

    if (this.props.proportion) {
      props['data-proportion'] = this.props.proportion;
      textProps['data-proportion'] = this.props.proportion;
    }

    let author = null;
    if (this.props.image.author) {
      author = (<div className='image-author'>&copy; {this.props.image.author}</div>);
    }

    return (
      <div {...props}>
        <div className='image-content' ref='container'>
          <Image {...image} className='show-for-large' width={1920} height={800} />
          <Image {...image} className='show-for-medium' width={1000} height={800} />
          <Image {...image} className='show-for-small' width={600} height={600} />
        </div>
        {author}
        <div className='image-text full-height' {...textProps}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
