import React from 'react';
import BaseWidget from './BaseWidget';
import DOMManipulator from '../../DOMManipulator';
import { merge } from '../../Helpers';

export default class Video extends BaseWidget {
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
    ]),
    derived: React.PropTypes.array
  };

  static validate(props) {
    if (!props.src) {
      throw new Error('Attribute "src" missing');
    }

    if (props.width && !BaseWidget.isNumeric(props.width)) {
      throw new Error('Attribute "width" fails type check');
    }

    if (props.height && !BaseWidget.isNumeric(props.height)) {
      throw new Error('Attribute "height" fails type check');
    }
  }

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
    height: '100%',
    derived: []
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

  getBaseUrl() {
    let regexp = new RegExp(`\.(mov|avi|mpe?g|${this.props.formats.join('|')})$`, 'i');
    return this.props.src.replace(regexp, '');
  }

  getPoster(params) {
    params = merge({
      width: 100,
      height: 100,
      mode: 'fit',
      gravity: 'center'
    }, params || {});
    let poster = this.props.poster || `${this.getBaseUrl()}.png`;
    return poster.replace(/upload\//, `upload/w_${params.width},h_${params.height},c_${params.mode},g_${params.gravity}/`);
  }

  getVideo() {
    let classes = ['video'];
    if (this.props.className) {
      classes.push(this.props.className);
    }

    if (this.props.mode === 'iframe') {
      classes.push('iframe');
      return (<iframe src={this.props.src} width='100%' height='100%' frameBorder='0' webkitallowfullscreen mozallowfullscreen allowFullScreen className={classes.join(' ')}></iframe>);
    }

    if (this.props.mode === 'html5') {
      classes.push('inline');
      let baseUrl = this.getBaseUrl();
      let video = {
        poster: this.getPoster(),
        controls: this.props.controls,
        autoPlay: this.props.autoPlay,
        loop: this.props.loop,
        width: this.props.width,
        height: this.props.height,
        className: classes.join(' ')
      };

      if (Array.isArray(this.props.derived) && this.props.derived.length) {
        console.error('derived', this.props.derived);
        return (
          <video {...video}>
            {
              this.props.derived.map((derived, index) => {
                let type = `video/${derived.format}`;
                return (
                  <source src={derived.url} type={type} key={index} />
                );
              })
            }
          </video>
        );
      }

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

  renderWidget() {
    this.resolveAspectRatio();

    if (!this.props.src) {
      console.error('No `src` defined for video, cannot continue', this.props);
      return null;
    }

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
