import React from 'react';
import classNames from 'classnames';
import Image from './Image';
import Video from './Video';
import BigBlock from './BigBlock';
import DOMManipulator from '../../DOMManipulator';
import { scrollTop } from '../../Helpers';

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
    author: React.PropTypes.string,
    zIndex: React.PropTypes.number
  };

  static defaultProps = {
    mode: 'html5',
    author: null,
    poster: null,
    proportion: 1,
    align: 'center',
    valign: 'middle',
    zIndex: -10
  };

  constructor() {
    super();
    this.togglePlay = this.togglePlay.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.pauseVideo = this.pauseVideo.bind(this);
    this.muteVideo = this.muteVideo.bind(this);
    this.unmuteVideo = this.unmuteVideo.bind(this);
    this.onCanPlay = this.onCanPlay.bind(this);
    this.containerTolerance = -150;
    this.position = null;
    this.inFullscreen = false;
    this.muteChanged = false;
    this.canPlay = false;
    this.shouldPlay = true;
  }

  componentDidMount() {
    debug('Video player mounted');
    if (!this.refs.video) {
      return null;
    }

    this.onMounted();
    this.video = React.findDOMNode(this.refs.video);

    // this.containerControls();
    this.playbackControls();
    this.loaderControls();
    this.volumeControls();
    this.positionControls();
    this.fullscreenControls();
  }

  componentWillUnmount() {
    if (!this.refs.video) {
      return null;
    }

    this.onUnmount();
  }

  containerControls() {
    debug('containerControls');
    this.container = new DOMManipulator(this.refs.container);
    let prev = null;
    let ts = null;

    // Start watching the touches
    this.container.addEvent('touchstart', (event) => {
      debug('Touch', event);
      if (!event.target.className.match(/\bcontent\b/)) {
        return null;
      }
      prev = event;
      ts = (new Date()).getTime();
    }, false);

    // Reset the previous event so that moves do not count
    this.container.addEvent('touchmove', () => {
      prev = null;
    }, false);

    this.container.addEvent('touchend', (event) => {
      if (!prev) {
        debug('No previous found');
        return null;
      }
      if (!event.target.className.match(/\bcontent\b/)) {
        debug('Not in the content');
        return null;
      }
      if (Math.abs(prev.pageX - event.pageX) > 10 || Math.abs(prev.pageY - event.pageY) > 10) {
        debug('Touch moved');
        return null;
      }
      if ((new Date()).getTime() - ts > 500) {
        debug('Touch lasted too long');
      }
      this.video.play();
    });
    debug(this.container);
  }

  playbackControls() {
    // Play button
    this.play = new DOMManipulator(this.refs.play);
    this.play.addEvent('click', this.playVideo, true);
    this.play.addEvent('touch', this.playVideo, true);

    // Pause button
    this.pause = new DOMManipulator(this.refs.pause);
    this.pause.addClass('hidden');
    this.pause.addEvent('click', this.pauseVideo, true);
    this.pause.addEvent('touch', this.pauseVideo, true);

    // Mobile play button
    this.mobilePlay = new DOMManipulator(this.refs.mobilePlay);
    this.mobilePlay.addEvent('click', this.playVideo, true);
    this.mobilePlay.addEvent('touch', this.playVideo, true);

    // Mobile play button
    this.mobilePause = new DOMManipulator(this.refs.mobilePause);
    this.mobilePause.addEvent('click', this.pauseVideo, true);
    this.mobilePause.addEvent('touch', this.pauseVideo, true);
    this.mobilePause.addClass('hidden');

    // General video events
    this.video.addEventListener('play', () => {
      this.play.addClass('hidden');
      this.pause.removeClass('hidden');
      this.mobilePlay.addClass('hidden');
      this.mobilePause.removeClass('hidden');
    });
    this.video.addEventListener('pause', () => {
      this.play.removeClass('hidden');
      this.pause.addClass('hidden');
      this.mobilePlay.removeClass('hidden');
      this.mobilePause.addClass('hidden');
    });
    this.video.addEventListener('click', this.togglePlay.bind(this));
    this.video.addEventListener('touch', this.togglePlay.bind(this));

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

    this.video.addEventListener('canplay', this.onCanPlay);
    this.video.addEventListener('playing', () => {
      this.loader.addClass('hidden');
    });
  }

  onCanPlay() {
    this.canPlay = true;
    debug('canplay');
    if (this.container.attr('data-viewport') === 'visible') {
      this.playVideo();
      this.video.removeEventListener('canplay', this.onCanPlay);
    }
  }

  loaderControls() {
    this.loader = new DOMManipulator(this.refs.loader);
    let bar = this.loader.getByClass('bar')[0];

    this.video.addEventListener('progress', () => {
      if (!this.video.paused) {
        return null;
      }

      let range = 0;
      let bf = this.video.buffered;
      let time = this.video.currentTime;
      try {
        while(!(bf.start(range) <= time && time <= bf.end(range))) {
          range += 1;
        }
        let loadStartPercentage = bf.start(range) / this.video.duration;
        let loadEndPercentage = bf.end(range) / this.video.duration;
        let loadPercentage = 100 * (loadEndPercentage - loadStartPercentage);
        bar.css({
          width: `${loadPercentage}%`
        });
      } catch (error) {
        debug('Error', error);
        bar.css({
          width: 0
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
    this.positionController = new DOMManipulator(this.refs.position);
    this.bar = this.positionController.getByClass('bar')[0];
    this.bar.skipAnimation = () => {
      this.bar.addClass('no-transitions');
      setTimeout(() => {
        this.bar.removeClass('no-transitions');
      }, 1000);
    };

    // Set the progress indicator when the time is updated
    this.video.addEventListener('timeupdate', () => {
      if (this.video.paused) {
        return null;
      }

      if (!this.bar) {
        return null;
      }
      this.position = this.video.currentTime / this.video.duration;
      this.bar.css('width', `${this.position * 100}%`);
    });

    this.positionController.addEvent('mousedown', this.onPositionChange.bind(this), true);
    this.positionController.addEvent('touchstart', this.onPositionChange.bind(this), true);
  }

  onPositionChange(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    let x = event.offsetX || event.layerX || 0;
    let pos = x / this.positionController.width();
    this.video.currentTime = pos * this.video.duration;
    this.loader.addClass('hidden');
    this.bar.skipAnimation();
  }

  fullscreenControls() {
    this.fullscreen = new DOMManipulator(this.refs.fullscreen);
    this.wrapper = new DOMManipulator(this.refs.wrapper);
    let prevScroll = 0;

    if (!this.fullscreen.fullscreenEnabled()) {
      this.fullscreen.addClass('hidden');
    }

    let toggleFullscreen = (event) => {
      this.inFullscreen = true;
      // Store the scroll top
      if (!prevScroll) {
        prevScroll = scrollTop();
      }

      this.container.toggleFullscreen(
        () => {
          this.fullscreen.addClass('in-fullscreen');
          this.wrapper.addClass('fullscreen');
          this.unmuteVideo();
        },
        () => {
          this.fullscreen.removeClass('in-fullscreen');
          this.wrapper.removeClass('fullscreen');
          this.inFullscreen = false;

          setTimeout(() => {
            // Use the previous scroll top to return to the original location
            if (prevScroll) {
              scrollTop(prevScroll, 10);
              prevScroll = 0;
            }
          }, 200);
        }
      );
      event.preventDefault();
      event.stopPropagation();
    };

    this.fullscreen.addEvent('click', toggleFullscreen, true);
    this.fullscreen.addEvent('touchstart', toggleFullscreen, true);
  }

  // Invoked when the container is visible on the screen (note: this.threshold)
  onDisplayContainer() {
    if (!this.video || this.inFullscreen) {
      return null;
    }
    // debug('onDisplayContainer');
    this.bar.skipAnimation();
    let iPhone = false;

    if (navigator && navigator.platform && /iPhone|iPod/.test(navigator.platform)) {
      iPhone = true;
    }

    if (!this.muteChanged) {
      this.video.muted = true;
    }
    if (this.canPlay && !iPhone && this.shouldPlay) {
      this.video.currentTime = 0;
      this.video.play();
    }
  }

  // Invoked when the container is invisible on the screen (note: this.threshold)
  onHideContainer() {
    if (!this.video || this.inFullscreen) {
      return null;
    }
    // debug('onHideContainer');
    this.video.pause();
  }

  // Toggle the play state of the video
  togglePlay(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
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
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      this.shouldPlay = true;
    }
    if (!this.muteChanged) {
      this.video.muted = false;
    }
    this.video.play();
    this.wrapper.addClass('is-playing');
  }

  pauseVideo(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      this.shouldPlay = false;
    }
    this.video.pause();
    this.wrapper.removeClass('is-playing');
  }

  muteVideo(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.muteChanged = true;
    this.video.muted = true;
  }

  unmuteVideo(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.muteChanged = true;
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

    if (this.props.className) {
      classes.push(this.props.className);
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

    if (Array.isArray(this.props.video.derived) && this.props.video.derived.length) {
      video.derived = this.props.video.derived;
    }

    debug('video', video);

    let image = {
      src: video.src.replace(/\.[a-z0-9]{2,4}$/i, '.jpg'),
      alt: '',
      mode: 'fill',
      gravity: 'center'
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
        <div {...props} ref='wrapper'>
          <div className='mobile-icons hidden'>
            <i className='fa fa-play' ref='mobilePlay'></i>
            <i className='fa fa-pause show-for-small' ref='mobilePause'></i>
          </div>
          <div className='image-content'>
            <Image {...image} className='show-for-small' width={640} />
            <Video {...video} className='big-video hide-for-small' ref='video' />
          </div>
          {author}
          <div className='image-text full-height' {...textProps}>
            {this.props.children}
          </div>
          <div className='loader hide-for-small' ref='loader'>
            <div className='bar'></div>
          </div>
          <div className='controls'>
            <div className='position' ref='position'>
              <div className='bar'></div>
            </div>
            <i className='controller fa fa-play play' ref='play'></i>
            <i className='controller fa fa-pause pause' ref='pause'></i>
            <i className='controller fa fa-volume-up volume mute hide-for-small' ref='mute'></i>
            <i className='controller fa fa-volume-off volume unmute hide-for-small' ref='unmute'></i>
            <i className='controller fullscreen hide-for-small' ref='fullscreen'>
              <i className='fa enter fa-arrows-alt'></i>
              <i className='fa exit fa-compress'></i>
            </i>
          </div>
        </div>
      </div>
    );
  }
}
