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
    this.position = null;
  }

  componentDidMount() {
    debug('Video player mounted');
    this.onMounted();
    this.video = React.findDOMNode(this.refs.video);

    this.playbackControls();
    this.volumeControls();
    this.positionControls();

    // Fullscreen button
    this.fullscreen = new DOMManipulator(this.refs.fullscreen);

    if (this.container) {
      this.container.addEvent('mousedown', this.togglePlay.bind(this), false);
    }
  }

  componentWillUnmount() {
    this.onUnmount();
    if (this.container) {
      this.container.removeEvent('mousedown', this.togglePlay.bind(this), false);
    }
  }

  playbackControls() {
    // Play button
    this.play = new DOMManipulator(this.refs.play);
    this.play.addClass('hidden');
    this.play.addEvent('mousedown', this.playVideo, true);
    this.play.addEvent('touchstart', this.playVideo, true);

    // Pause button
    this.pause = new DOMManipulator(this.refs.pause);
    this.pause.addEvent('mousedown', this.pauseVideo, true);
    this.pause.addEvent('touchstart', this.pauseVideo, true);

    this.video.addEventListener('play', () => {
      this.play.addClass('hidden');
      this.pause.removeClass('hidden');
    });
    this.video.addEventListener('pause', () => {
      this.play.removeClass('hidden');
      this.pause.addClass('hidden');
    });
    this.video.addEventListener('ended', () => {
      this.video.pause();
      this.video.currentTime = 0;
      if (this.bar) {
        this.bar.addClass('no-transitions');
        this.bar.width(0);
        setTimeout(() => {
          this.bar.removeClass('no-transitions');
        });
      }
    });
  }

  volumeControls() {
    // Mute button
    this.mute = new DOMManipulator(this.refs.mute);
    this.mute.addEvent('mousedown', this.muteVideo, true);
    this.mute.addEvent('touchstart', this.muteVideo, true);

    // Unmute button
    this.unmute = new DOMManipulator(this.refs.unmute);
    this.unmute.addClass('hidden');
    this.unmute.addEvent('mousedown', this.unmuteVideo, true);
    this.unmute.addEvent('touchstart', this.unmuteVideo, true);

    this.video.addEventListener('volumechange', () => {
      if (this.video.muted) {
        this.mute.addClass('hidden');
        this.unmute.removeClass('hidden');
      } else if (!this.video.paused) {
        this.mute.removeClass('hidden');
        this.unmute.addClass('hidden');
      }
    });
  }

  positionControls() {
    this.position = new DOMManipulator(this.refs.position);
    this.bar = this.position.getByClass('bar')[0];
    this.video.addEventListener('timeupdate', (event) => {
      if (this.video.paused) {
        return null;
      }

      if (!this.bar) {
        return null;
      }
      this.position = this.video.currentTime / this.video.duration;
      this.bar.css('width', `${this.position * 100}%`);
    });
  }

  onDisplayContainer() {
    if (!this.video) {
      return null;
    }
    this.video.muted = true;
    this.video.currentTime = 0;
    this.video.play();
  }

  onHideContainer() {
    if (!this.video) {
      return null;
    }
    this.video.pause();
  }

  togglePlay(event) {
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
    event.stopPropagation();
    event.preventDefault();
    this.video.muted = false;
    this.video.play();
  }

  pauseVideo(event) {
    event.stopPropagation();
    event.preventDefault();
    this.video.muted = true;
    this.video.pause();
  }

  muteVideo(event) {
    event.stopPropagation();
    event.preventDefault();
    this.video.muted = true;
  }

  unmuteVideo(event) {
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
      loop: false,
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
          <div className='controls hide-for-small'>
            <div className='position' ref='position'>
              <div className='bar'></div>
            </div>
            <i className='fa fa-play play' ref='play'></i>
            <i className='fa fa-pause pause' ref='pause'></i>
            <i className='fa fa-volume-up volume mute hidden' ref='mute'></i>
            <i className='fa fa-volume-off volume unmute' ref='unmute'></i>
            <i className='fa fa-arrows-alt fullscreen' ref='fullscreen'></i>
          </div>
        </div>
        <Separator type='white' />
      </div>
    );
  }

}
