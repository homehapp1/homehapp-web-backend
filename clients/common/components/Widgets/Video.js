'use strict';
import React from 'react';
import Image from './Image';
import DOMManipulator from '../../DOMManipulator';

export default class Video extends React.Component {
  static propTypes = {
    src: React.PropTypes.string.isRequired,
    mode: React.PropTypes.string,
    aspectRatio: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    className: React.PropTypes.string,
    formats: React.PropTypes.array,
    poster: React.PropTypes.string,
    autoPlay: React.PropTypes.bool,
    loop: React.PropTypes.bool,
    controls: React.PropTypes.bool,
    standalone: React.PropTypes.bool,
    width: React.PropTypes.oneOfType([
      React.PropTypes.null,
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    height: React.PropTypes.oneOfType([
      React.PropTypes.null,
      React.PropTypes.number,
      React.PropTypes.string
    ])
  };

  static defaultProps = {
    mode: 'html5',
    aspectRatio: 16 / 9,
    className: null,
    formats: [
      'webm',
      'mp4',
      'ogg'
    ],
    poster: null,
    autoPlay: false,
    loop: false,
    controls: true,
    standalone: false,
    width: '100%',
    height: '100%'
  };

  constructor() {
    super();
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    if (!this.refs.container) {
      return;
    }

    this.container = new DOMManipulator(this.refs.container);
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize() {
    let width = this.container.parent().width();
    let height = width / this.aspectRatio;

    if (this.aspectRatio < 1) {
      height = this.container.width();
      width = height * this.aspectRatio;
    }

    this.container.css({
      width: `${width}px`,
      height: `${height}px`
    });
  }

  resolveAspectRatio() {
    let aspectRatio = Number(this.props.aspectRatio);
    if (isNaN(aspectRatio)) {
      let regs = this.props.aspectRatio.match(/^([0-9]+):([0-9]+)$/);
      if (regs) {
        aspectRatio = Number(regs[1]) / Number(regs[2]);
      } else {
        aspectRatio = 16 / 9;
        console.warn('Invalid aspect ratio, fall back to 16:9');
      }
    }

    // Normalize between 1:10 and 10:1 to keep some sanity
    this.aspectRatio = Math.min(10, Math.max(aspectRatio, 1 / 10));
  }

  getVideo() {
    if (this.props.mode === 'iframe') {
      return (<iframe src={this.props.src} width='100%' height='100%' frameBorder='0' webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe>);
    }

    if (this.props.mode === 'html5') {
      let regexp = new RegExp(`\.(mov|avi|mpe?g|${this.props.formats.join('|')})$`, 'i');
      let baseUrl = this.props.src.replace(regexp, '');
      let poster = this.props.poster || `${baseUrl}.jpg`;

      let video = {
        poster: poster,
        controls: this.props.controls,
        autoPlay: this.props.autoPlay,
        loop: this.props.loop,
        width: this.props.width,
        height: this.props.height
      };

      return (
        <video {...video}>
          {
            this.props.formats.map((format, index) => {
              let src = `${baseUrl}.${format}`;
              let type = `video/${format}`.toLowerCase();
              return (
                <source src={src} type={type} key={index} />
              );
            })
          }
        </video>
      );
    }

    return `Not yet implemented '${this.props.mode}' with src '${this.props.src}'`;
  }

  render() {
    this.resolveAspectRatio();

    if (!this.props.src) {
      console.error('No `src` defined for video, cannot continue', this.props);
      return null;
    }

    let image = {
      src: `images/icons/white/${this.props.type}.svg`,
      alt: '',
      type: 'asset'
    };

    let classes = ['widget', 'video'];

    if (this.props.className) {
      classes.push(this.props.className);
    }

    let video = this.getVideo();

    // Skip the wrappers, serve only the pure video
    if (this.props.standalone) {
      return video;
    }

    return (
      <div className={classes.join(' ')}>
        <div className='video-wrapper' ref='container'>
          {video}
        </div>
      </div>
    );
  }
}
