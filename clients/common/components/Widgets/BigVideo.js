'use strict';

import React from 'react';
import classNames from 'classnames';
import Video from './Video';
import Separator from './Separator';
import BigBlock from './BigBlock';
import DOMManipulator from '../../DOMManipulator';

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
    this.playVideo = this.playVideo.bind(this);
    this.pauseVideo = this.pauseVideo.bind(this);
    this.muteVideo = this.muteVideo.bind(this);
    this.unmuteVideo = this.unmuteVideo.bind(this);
    this.containerTolerance = -150;
  }

  componentDidMount() {
    this.onMounted();
    this.video = React.findDOMNode(this.refs.video);

    // Play button
    this.play = new DOMManipulator(this.refs.play);
    this.play.addClass('hidden');
    this.play.addEvent('mousedown', this.playVideo, true);
    this.play.addEvent('touchstart', this.playVideo, true);

    // Pause button
    this.pause = new DOMManipulator(this.refs.pause);
    this.pause.addEvent('mousedown', this.pauseVideo, true);
    this.pause.addEvent('touchstart', this.pauseVideo, true);

    // Mute button
    this.mute = new DOMManipulator(this.refs.mute);
    this.mute.addClass('hidden');
    this.mute.addEvent('mousedown', this.muteVideo, true);
    this.mute.addEvent('touchstart', this.muteVideo, true);

    // Unmute button
    this.unmute = new DOMManipulator(this.refs.unmute);
    this.unmute.addEvent('mousedown', this.unmuteVideo, true);
    this.unmute.addEvent('touchstart', this.unmuteVideo, true);

    // Fullscreen button
    this.fullscreen = new DOMManipulator(this.refs.fullscreen);

    this.video.onplay = () => {
      this.play.addClass('hidden');
      this.pause.removeClass('hidden');
    };
    this.video.onpause = () => {
      this.play.removeClass('hidden');
      this.pause.addClass('hidden');
    };
    this.video.onvolumechange = () => {
      if (this.video.muted && this.video.playing) {
        this.mute.addClass('hidden');
        this.unmute.removeClass('hidden');
      } else {
        this.mute.removeClass('hidden');
        this.unmute.addClass('hidden');
      }
    };

    if (this.container) {
      this.container.addEvent('mousedown', this.togglePlay.bind(this), false);
    }
    debug('Video', this.refs.video, this.video);
  }

  componentWillUnmount() {
    this.onUnmount();
    if (this.container) {
      this.container.removeEvent('mousedown', this.togglePlay.bind(this), false);
    }
  }

  onDisplayContainer() {
    if (!this.video) {
      return null;
    }
    debug('Video playing');
    this.video.muted = true;
    this.video.play();
  }

  onHideContainer() {
    if (!this.video) {
      return null;
    }
    debug('Video paused');
    this.video.pause();
  }

  togglePlay(event) {
    debug('togglePlay', event);
    if (event.target.parentNode.className.match(/controls/)) {
      return true;
    }
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

  playVideo(event) {
    debug('playVideo');
    event.stopPropagation();
    event.preventDefault();
    this.video.muted = false;
    this.video.play();
  }

  pauseVideo(event) {
    debug('pauseVideo');
    event.stopPropagation();
    event.preventDefault();
    this.video.muted = true;
    this.video.pause();
  }

  muteVideo(event) {
    debug('muteVideo');
    event.stopPropagation();
    event.preventDefault();
    this.video.muted = true;
  }

  unmuteVideo(event) {
    debug('unmuteVideo');
    event.stopPropagation();
    event.preventDefault();
    this.video.muted = false;
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
          <div className='controls'>
            <i className='fa fa-volume-off mute' ref='mute'></i>
            <i className='fa fa-volume-up unmute' ref='unmute'></i>
            <i className='fa fa-play play' ref='play'></i>
            <i className='fa fa-pause pause' ref='pause'></i>
            <i className='fa fa-arrows-alt fullscreen' ref='fullscreen'></i>
          </div>
        </div>
        <Separator type='white' />
      </div>
    );
  }

}
