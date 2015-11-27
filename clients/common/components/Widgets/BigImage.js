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
    aspectRatio: React.PropTypes.number,
    children: React.PropTypes.oneOfType([
      React.PropTypes.null,
      React.PropTypes.array,
      React.PropTypes.object
    ]),
    align: React.PropTypes.string,
    valign: React.PropTypes.string,
    className: React.PropTypes.string
  };

  static defaultProps = {
    fixed: false,
    proportion: null,
    aspectRatio: null,
    align: 'center',
    valign: 'middle',
    className: null,
    zIndex: -10
  };

  getRelativeHeight(width, height) {
    if (!this.props.aspectRatio) {
      return height;
    }

    return Math.round(width / this.props.aspectRatio);
  }

  getBigImage(image) {
    let width = 1920;
    let height = this.getRelativeHeight(width, 800);
    return (
      <Image {...image} className='show-for-large' width={width} height={height} />
    );
  }

  getMediumImage(image) {
    let width = 1000;
    let height = this.getRelativeHeight(width, 800);
    return (
      <Image {...image} className='show-for-medium' width={width} height={height} />
    );
  }

  getSmallImage(image) {
    let width = 600;
    let height = this.getRelativeHeight(width, 400);
    return (
      <Image {...image} className='show-for-small' width={width} height={height} />
    );
  }

  render() {
    let classes = ['widget', 'big-image'];
    let classesText = ['image-text'];

    let textProps = {};

    if (this.props.fixed) {
      classes.push('fixed');
    }

    if (this.props.className) {
      classes.push(this.props.className);
    }

    let image = merge({}, this.props.image);
    image.mode = 'fill';

    let props = {
      'data-gradient': this.props.gradient,
      'data-align': this.props.align,
      'data-valign': this.props.valign
    };

    if (this.props.proportion) {
      props['data-proportion'] = this.props.proportion;
      textProps['data-proportion'] = this.props.proportion;
    }

    if (this.props.aspectRatio) {
      props['data-aspect-ratio'] = this.props.aspectRatio;
      textProps['data-aspect-ratio'] = this.props.aspectRatio;
      classes.push('aspect-ratio');
      classesText.push('aspect-ratio');
    } else {
      classes.push('full-height');
      classesText.push('full-height');
    }

    props.className = classNames(classes);

    let author = null;
    if (this.props.image.author) {
      author = (<div className='image-author'>&copy; {this.props.image.author}</div>);
    }

    return (
      <div {...props}>
        <div className='image-content' ref='container'>
          {this.getBigImage(image)}
          {this.getMediumImage(image)}
          {this.getSmallImage(image)}
        </div>
        {author}
        <div className={classesText.join(' ')} {...textProps}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
