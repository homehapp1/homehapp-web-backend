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
    className: React.PropTypes.string
  };

  static defaultProps = {
    mode: 'html5',
    aspectRatio: 16 / 9,
    className: null
  };

  constructor() {
    super();
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
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

    return `Not yet implemented '${this.props.mode}' with src '${this.props.src}'`;
  }

  render() {
    this.resolveAspectRatio();

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

    return (
      <div className={classes.join(' ')}>
        <div className='video-wrapper' ref='container'>
          {video}
        </div>
      </div>
    );
  }
}
