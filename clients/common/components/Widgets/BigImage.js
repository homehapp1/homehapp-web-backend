'use strict';

import React from 'react';
import ApplicationStore from '../../stores/ApplicationStore';
import { setFullHeight } from '../../Helpers';
import classNames from 'classnames';

class BigImage extends React.Component {
  static propTypes = {
    src: React.PropTypes.string,
    alt: React.PropTypes.string,
    fixed: React.PropTypes.bool,
    gradient: React.PropTypes.string,
    children: React.PropTypes.object
  };

  constructor() {
    super();
    this.storeListener = this.onStateChange.bind(this);
  }

  componentDidMount() {
    setFullHeight();
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

    let classes = [
      'item',
      'big-image',
      'full-height'
    ];

    if (this.props.fixed) {
      classes.push('fixed');
    }

    let alt = this.props.alt || '';

    let images = {
      small: `${this.state.config.cloudinary.baseUrl}${this.state.config.cloudinary.transformations.small}/${this.props.src}`,
      medium: `${this.state.config.cloudinary.baseUrl}${this.state.config.cloudinary.transformations.medium}/${this.props.src}`,
      large: `${this.state.config.cloudinary.baseUrl}${this.state.config.cloudinary.transformations.large}/${this.props.src}`
    };

    return (
      <div className={classNames(classes)} data-gradient={this.props.gradient}>
        <div className='image-content'>
          <img alt={alt} className='show-for-large' src={images.large} />
          <img alt={alt} className='show-for-medium' src={images.medium} />
          <img alt={alt} className='show-for-small' src={images.small} />
        </div>
        <div className='width-wrapper full-height'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default BigImage;
