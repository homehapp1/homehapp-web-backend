'use strict';

import React from 'react';
import ApplicationStore from '../../stores/ApplicationStore';
import { merge } from '../../Helpers';
// import classNames from 'classnames';

class Image extends React.Component {
  static propTypes = {
    src: React.PropTypes.string,
    url: React.PropTypes.string,
    alt: React.PropTypes.string.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    aspectRatio: React.PropTypes.number,
    title: React.PropTypes.string,
    type: React.PropTypes.string,
    variant: React.PropTypes.string,
    mode: React.PropTypes.string,
    linked: React.PropTypes.string,
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
    applySize: false
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
    if (this.props.width) {
      this.attributes.width = this.props.width;
    }

    if (this.props.height) {
      this.attributes.height = this.props.height;
    }

    this.attributes.alt = this.props.alt || '';
    this.attributes.title = this.props.title || this.attributes.alt;

    // Determines if the width and height should be explicitly added to the
    // DOM object attributes
    if (this.props.applySize) {
      this.applyDimensions();
    }

    if (this.props.className) {
      this.attributes.className = this.props.className;
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

    switch (this.props.type) {
      case 'asset':
        rval = `${this.state.config.revisionedStaticPath}/${src}`;
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

  resolveContentSrc(src, variant) {
    let mask = '';
    let options = [];
    let params = merge({}, this.props);
    this.getVariant(params, variant);

    for (let i in params) {
      if (!params[i]) {
        continue;
      }

      switch (i) {
        case 'width':
          options.push(`w_${params[i]}`);
          break;

        case 'height':
          options.push(`h_${params[i]}`);
          break;

        case 'mode':
          options.push(`c_${params[i]}`);
          break;

        case 'gravity':
          options.push(`g_${params[i]}`);
          break;

        case 'mask':
          mask = `/l_${params[i]},fl_cutter`;

          if (src.match(/\.jpe?g$/i)) {
            src = src.replace(/\.jpe?g$/i, '.png');
          }
          break;
      }
    }

    // Load everything in interlaced/progressive mode to show
    // content to the users as quickly as possible
    options.push('fl_progressive');

    return `${this.state.config.cloudinary.baseUrl}${options.join(',')}${mask}/${src}`;
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

  render() {
    if (!this.state.config) {
      return null;
    }

    let params = this.resolveParams();
    this.resolveAttributes();
    this.attributes.src = params.src;

    return this.renderImage();
  }

  renderImage() {
    // Linked, i.e. refer usually to a larger version of the same image
    if (this.props.linked) {
      let href = this.resolveSrc(this.props.linked);
      return (
        <a href={href}>
          <img {...this.attributes} />
        </a>
      );
    }

    return (
      <img {...this.attributes} />
    );
  }
}

export default Image;
