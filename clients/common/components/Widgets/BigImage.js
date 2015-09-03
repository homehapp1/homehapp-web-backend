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

  componentDidMount() {
    setFullHeight();
  }

  render() {
    let classes = [
      'widget',
      'big-image',
      'full-height'
    ];

    console.log('BigImage', this.props);

    let textProps = {};

    if (this.props.fixed) {
      classes.push('fixed');
    }

    let image = this.props.image;
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
        <div className='image-content'>
          <Image {...image} className='show-for-large' width={1920} mode='scale' />
          <Image {...image} className='show-for-medium' width={1000} mode='scale' />
          <Image {...image} className='show-for-small' height={600} mode='fill' />
        </div>
        {author}
        <div className='image-text full-height' {...textProps}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default BigImage;
