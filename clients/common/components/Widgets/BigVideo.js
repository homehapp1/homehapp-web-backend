'use strict';

import React from 'react';
import classNames from 'classnames';
import Video from './Video';
import Separator from './Separator';
import BigBlock from './BigBlock';

let debug = require('debug')('BigVideo');

export default class BigVideo extends BigBlock {
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

  constructor() {
    super();
    this.togglePlay = this.togglePlay.bind(this);
  }

  componentDidMount() {
    this.onMounted();
    this.video = React.findDOMNode(this.refs.video);
    if (this.container) {
      this.container.addEvent('mousedown', this.togglePlay.bind(this), true);
    }
    debug('Video', this.refs.video, this.video);
  }

  componentWillUnmount() {
    this.onUnmount();
    if (this.container) {
      this.container.removeEvent('mousedown', this.togglePlay.bind(this), true);
    }
  }

  togglePlay(event) {
    event.preventDefault();
    if (!this.video) {
      return null;
    }
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
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

    if (!this.props.video || !this.props.video.url) {
      console.warn('Tried to create a BigVideo block without a video', this.props.video);
      return null;
    }

    let video = {
      src: this.props.video.url,
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
      <div className='bigvideo-wrapper' ref='container'>
        <div {...props}>
          <div className='image-content'>
            <Video {...video} className='big-video' ref='video' />
          </div>
          {author}
          <div className='image-text full-height' {...textProps}>
            {this.props.children}
          </div>
        </div>
        <Separator type='white' />
      </div>
    );
  }

}
