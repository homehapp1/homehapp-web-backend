'use strict';

import React from 'react';
import ApplicationStore from '../../stores/ApplicationStore';
import { merge } from '../../Helpers';
// import classNames from 'classnames';

export default class Image extends React.Component {
  static propTypes = {
    src: React.PropTypes.string,
    url: React.PropTypes.string,
    alt: React.PropTypes.string.isRequired,
    width: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    height: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    aspectRatio: React.PropTypes.number,
    title: React.PropTypes.string,
    type: React.PropTypes.string,
    variant: React.PropTypes.string,
    mode: React.PropTypes.string,
    linked: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.bool,
      React.PropTypes.null
    ]),
    gravity: React.PropTypes.string,
    className: React.PropTypes.string,
    applySize: React.PropTypes.bool
  };

  static defaultProps = {
    width: null,
    height: null,
    alt: '',
    title: '',
    type: 'content',
    mode: null,
    applySize: false,
    gravity: 'center',
    linked: ''
  };

  constructor() {
    super();
    this.storeListener = this.onStateChange.bind(this);
    this.attributes = {};
  }

  componentDidMount() {
    ApplicationStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    ApplicationStore.unlisten(this.storeListener);
  }

  state = {
    config: ApplicationStore.getState().config
  }

  onStateChange() {
    this.setState({
      config: ApplicationStore.getState().config
    });
  }

  resolveParams() {
    let params = {};
    params.src = this.resolveSrc(this.props.variant);
    return params;
  }

  resolveAttributes() {
    if (this.props.width && this.props.applySize !== false) {
      this.attributes.width = this.props.width;
    }

    if (this.props.height && this.props.applySize !== false) {
      this.attributes.height = this.props.height;
    }

    this.attributes.alt = this.props.alt || '';
    this.attributes.title = this.props.title || this.attributes.alt;

    if (this.props.className) {
      this.attributes.className = this.props.className;
    }

    if (this.props.width && this.props.height) {
      this.props.aspectRatio = this.props.width / this.props.height;
    }

    if (this.props.aspectRatio) {
      this.attributes['data-aspect-ratio'] = this.props.aspectRatio;
    }
  }

  applyDimensions() {
    let d = {
      width: this.attributes.width || this.props.width,
      height: this.attributes.height || this.props.height
    };

    if (this.props.variant) {
      let variant = this.state.config.cloudinary.transformations[this.props.variant];

      if (!d.width && variant.width) {
        d.width = variant.width;
      }

      if (!d.height && variant.height) {
        d.height = variant.height;
      }
    }

    if (this.props.aspectRatio) {
      if (d.width) {
        d.height = Math.round(d.width / this.props.aspectRatio);
      } else if (d.height) {
        d.width = Math.round(d.height * this.props.aspectRatio);
      }
    }

    for (let i in d) {
      if (d[i]) {
        this.attributes[i] = d[i];
      }
    }
  }

  resolveSrc(variant) {
    let src = this.props.src || this.props.url;
    let rval = null;
    src = src.replace(/^\//, '');

    switch (this.props.type) {
      case 'asset':
        let assetPath = this.state.config.revisionedStaticPath.replace(/\/raw\//, '/image/');
        rval = `${assetPath.replace(/\/$/, '')}/${src}`;
        break;

      case 'content':
        rval = this.resolveContentSrc(src, variant);
        break;

      default:
        console.error('Tried to use an undefined image type', this.props.type, this.props);
        throw new Error(`Undefined image type '${this.props.type.toString()}'`);
    }

    return rval;
  }

  getBaseUrl(src) {
    // Not prefixed with Cloudinary path
    if (!src.match(/^(https?:)?\/\//i)) {
      // In case the cloudinary path isn't available, use the hard coded one
      let p = this.state.config.cloudinary.basePath || 'https://res.cloudinary.com/homehapp/image/upload';
      return p.replace(/\/$/, '');
    }

    let regs = src.match(/^((https?:)?\/\/res.cloudinary.com\/.+upload\/)/);

    if (!regs) {
      return '';
    }

    return regs[1].replace(/\/$/, '');
  }

  getPath(src) {
    return src.replace(/^(https?:)?\/\/.+(v[0-9]+)/, '$2');
  }

  resolveContentSrc(src, variant) {
    let mask = '';
    let options = [];
    let params = merge({}, this.props);
    this.getVariant(params, variant);

    for (let i in params) {
      if (!params[i]) {
        continue;
      }

      let v = params[i];

      switch (i) {
        case 'width':
          if (v === 'auto') {
            break;
          }

          options.push(`w_${v}`);
          break;

        case 'height':
          if (v === 'auto') {
            break;
          }

          options.push(`h_${v}`);
          break;

        case 'mode':
          options.push(`c_${v}`);
          break;

        case 'gravity':
          options.push(`g_${v}`);
          break;

        case 'mask':
          mask = `/l_${v},fl_cutter`;

          if (src.match(/\.jpe?g$/i)) {
            src = src.replace(/\.jpe?g$/i, '.png');
          }
          break;
      }
    }

    // Load everything in interlaced/progressive mode to show
    // content to the users as quickly as possible
    options.push('fl_progressive');

    return `${this.getBaseUrl(src)}/${options.join(',')}${mask}/${this.getPath(src)}`;
  }

  getVariant(params, variant) {
    if (variant) {
      let d = this.state.config.cloudinary.transformations[variant];

      for (let i in d) {
        // Override only null and undefined
        if (typeof params[i] === 'undefined' || params[i] === null) {
          params[i] = d[i];
        }
      }
    }
  }

  renderImage() {
    // Linked, i.e. refer usually to a larger version of the same image
    if (this.props.linked) {
      let href = this.resolveSrc(this.props.linked);
      return (
        <a href={href} data-linked={this.props.linked}>
          <img {...this.attributes} />
        </a>
      );
    }

    return (
      <img {...this.attributes} />
    );
  }

  render() {
    if (!this.state.config) {
      return null;
    }

    if (!this.props.url && !this.props.src) {
      console.warn('No image url or src provided, use a placeholder instead', this.props);
      this.props.url = 'https://res.cloudinary.com/homehapp/image/upload/v1441913472/site/images/content/content-placeholder.jpg';
      this.props.alt = 'Placeholder';
    }

    let params = this.resolveParams();
    this.resolveAttributes();
    this.attributes.src = params.src;

    return this.renderImage();
  }
}
