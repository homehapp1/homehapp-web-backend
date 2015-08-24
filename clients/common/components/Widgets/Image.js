'use strict';

import React from 'react';
import ApplicationStore from '../../stores/ApplicationStore';
import { setFullHeight, imagePath } from '../../Helpers';
import classNames from 'classnames';

class Image extends React.Component {
  static propTypes = {
    src: React.PropTypes.string.isRequired,
    alt: React.PropTypes.string.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    aspectRatio: React.PropTypes.number,
    title: React.PropTypes.string,
    variant: React.PropTypes.string,
    linked: React.PropTypes.string,
    className: React.PropTypes.string
  };

  constructor() {
    super();
    this.storeListener = this.onStateChange.bind(this);
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

  render() {
    if (!this.state.config) {
      return null;
    }

    let variant = this.props.variant || null;
    let opts = null;
    let classes = [];

    if (this.props.className) {
      classes = this.props.className.split(' ');
    }

    if (variant) {
      opts = this.state.config.cloudinary.transformations[variant];
    }

    let params = {
      alt: this.props.alt,
      title: this.props.title || this.props.alt,
      src: imagePath(this.state.config, this.props.src, this.props.variant),
      width: this.props.width || null,
      height: this.props.height || null
    };

    if (typeof this.props.width !== 'undefined') {
      params.width = this.props.width;
    }

    if (this.props.height) {
      params.height = this.props.height;
    }

    // Use aspect ratio to define the width/height but only if
    // they weren't explicitly defined
    if (this.props.aspectRatio && !(params.width && params.height)) {
      if (typeof opts.width !== 'undefined') {
        params.width = opts.width;
        params.height = Math.round(opts.width / this.props.aspectRatio);
      } else if (typeof opts.height !== 'undefined') {
        params.height = opts.height;
        params.width = Math.round(opts.height * this.props.aspectRatio);
      }
    }

    if (classes.length) {
      params.className = classes;
    }

    if (this.props.linked) {
      let href = imagePath(this.state.config, this.props.src, this.props.linked);
      return (
        <a href={href}>
          <img {...params} />
        </a>
      );
    }

    return (
      <img {...params} />
    );
  }
}

export default Image;
