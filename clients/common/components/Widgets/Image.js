import React from 'react';
import ApplicationStore from '../../stores/ApplicationStore';
import { merge } from '../../Helpers';
import DOMManipulator from '../../DOMManipulator';
// import classNames from 'classnames';

let debug = require('../../../common/debugger')('Image');

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
    applySize: React.PropTypes.bool,
    align: React.PropTypes.string,
    valign: React.PropTypes.string
  }

  static defaultProps = {
    width: null,
    height: null,
    alt: '',
    title: '',
    className: null,
    type: 'content',
    mode: null,
    applySize: false,
    gravity: 'center',
    linked: '',
    align: null,
    valign: null
  }

  constructor() {
    super();
    this.storeListener = this.onStateChange.bind(this);
    this.attributes = {};
  }

  state = {
    config: ApplicationStore.getState().config
  }

  componentDidMount() {
    ApplicationStore.listen(this.storeListener);

    let img = new DOMManipulator(this.refs.image);
    img.addClass('loading');

    img.node.onload = function() {
      img.removeClass('loading');
    };

    img.node.onerror = function() {
      img.addClass('load-error');

      if (!img.attr('data-src')) {
        img.attr('data-src', img.attr('src'));
      }

      // Replace the broken src with pixel.gif
      // img.attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
    };
  }

  componentWillUnmount() {
    ApplicationStore.unlisten(this.storeListener);
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

  getClass() {
    let classes = ['image-widget', `type-${this.props.type}`];

    if (this.props.className) {
      classes.push(this.props.className);
    }
    return classes.join(' ');
  }

  setAspectRatio() {
    if (this.props.width && this.props.height) {
      this.aspectRatio = this.props.width / this.props.height;
    }

    if (this.props.aspectRatio) {
      this.aspectRatio = this.props.aspectRatio;
    }

    if (this.aspectRatio) {
      this.attributes['data-aspect-ratio'] = this.aspectRatio;
    }
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

    if (this.props.align) {
      this.attributes['data-align'] = this.props.align;
    }

    if (this.props.valign) {
      this.attributes['data-valign'] = this.props.valign;
    }

    this.attributes.className = this.getClass();
    this.setAspectRatio();

    return this.attributes;
  }

  setByAspectRatio(d) {
    if (!this.props.aspectRatio) {
      return null;
    }

    if (d.width) {
      d.height = Math.round(d.width / this.props.aspectRatio);
    } else if (d.height) {
      d.width = Math.round(d.height * this.props.aspectRatio);
    }
  }

  applySize() {
    let d = {
      width: this.attributes.width || this.props.width,
      height: this.attributes.height || this.props.height
    };

    let apply = !!(this.props.applySize);

    if (this.props.variant) {
      let variant = this.state.config.cloudinary.transformations[this.props.variant] || {};
      if (typeof variant.applySize !== 'undefined') {
        apply = variant.applySize;
      }

      if (!d.width && variant.width) {
        d.width = variant.width;
      }

      if (!d.height && variant.height) {
        d.height = variant.height;
      }
    }

    this.setByAspectRatio(d);

    if (apply) {
      this.propagateAttributes(d);
    }
  }

  propagateAttributes(d) {
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
        debug('Tried to use an undefined image type', this.props.type, this.props);
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

    return regs[1].replace(/\/$/, '').replace(/http:\/\//, 'https://');
  }

  getPath(src) {
    return src.replace(/^(https?:)?\/\/.+(v[0-9]+)/, '$2');
  }

  getOption(i, v) {
    let rval = null;

    switch (i) {
      case 'width':
        if (v === 'auto') {
          break;
        }

        rval = `w_${v}`;
        break;

      case 'height':
        if (v === 'auto') {
          break;
        }

        rval = `h_${v}`;
        break;

      case 'mode':
        rval = `c_${v}`;
        break;

      case 'gravity':
        rval = `g_${v}`;
        break;
    }

    return rval;
  }

  getOptions(params) {
    let options = [];
    for (let i in params) {
      if (!params[i]) {
        continue;
      }

      let val = this.getOption(i, params[i]);

      if (val) {
        options.push(val);
      }
    }
    return options;
  }

  resolveContentSrc(src, variant) {
    let mask = '';
    let params = merge({}, this.props);
    this.getVariant(params, variant);
    let options = this.getOptions(params);
    this.applySize();

    if (params.mask) {
      mask = `/l_${params.mask},fl_cutter`;

      if (src.match(/\.jpe?g$/i)) {
        src = src.replace(/\.jpe?g$/i, '.png');
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
          <img {...this.attributes} ref='image' />
        </a>
      );
    }

    return (
      <img {...this.attributes} ref='image' />
    );
  }

  render() {
    if (!this.state.config) {
      return null;
    }

    if (!this.props.url && !this.props.src) {
      debug('No image url or src provided, use a placeholder instead', this.props);
      this.props.url = 'https://res.cloudinary.com/homehapp/image/upload/v1441913472/site/images/content/content-placeholder.jpg';
      this.props.alt = 'Placeholder';
    }

    let params = this.resolveParams();
    this.resolveAttributes();
    this.attributes.src = params.src;

    return this.renderImage();
  }
}
