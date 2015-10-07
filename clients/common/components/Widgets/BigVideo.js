'use strict';

import React from 'react';
import { setFullHeight } from '../../Helpers';
import classNames from 'classnames';
import Video from './Video';

export default class BigVideo extends React.Component {
  static propTypes = {
    video: React.PropTypes.object.isRequired,
    className: React.PropTypes.string,
    poster: React.PropTypes.string,
    fixed: React.PropTypes.bool,
    gradient: React.PropTypes.string,
    proportion: React.PropTypes.number,
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]),
    align: React.PropTypes.string,
    valign: React.PropTypes.string,
    author: React.PropTypes.string
  };

  static defaultProps = {
    mode: 'html5',
    author: null,
    poster: null,
    proportion: 1,
    align: 'center',
    valign: 'middle'
  };

  componentDidMount() {
    setFullHeight();
  }

  render() {
    let classes = [
      'widget',
      'big-video',
      'full-height'
    ];

    let textProps = {
      'data-align': 'center',
      'data-valign': 'middle'
    };

    if (this.props.fixed) {
      classes.push('fixed');
    }

    let video = {
      src: this.props.video.url,
      autoPlay: true,
      loop: true,
      controls: false,
      mode: 'html5',
      standalone: true,
      width: null,
      height: null
    };

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
    if (this.props.author) {
      author = (<div className='image-author'>&copy; {this.props.author}</div>);
    }

    return (
      <div {...props}>
        <div className='image-content'>
          <Video {...video} className='big-video' />
        </div>
        {author}
        <div className='image-text full-height' {...textProps}>
          {this.props.children}
        </div>
      </div>
    );
  }

}
