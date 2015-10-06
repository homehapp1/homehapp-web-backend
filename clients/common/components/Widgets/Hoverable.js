'use strict';

import React from 'react';
import Image from './Image';
// import classNames from 'classnames';

export default class Hoverable extends React.Component {
  static propTypes = {
    src: React.PropTypes.string,
    url: React.PropTypes.string,
    alt: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    aspectRatio: React.PropTypes.number,
    title: React.PropTypes.string,
    variant: React.PropTypes.string,
    mode: React.PropTypes.string,
    linked: React.PropTypes.string,
    className: React.PropTypes.string,
    applySize: React.PropTypes.bool,
    gravity: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ])
  };

  static defaultProps = {
    applySize: true,
    gravity: 'center'
  };

  render() {
    return (
      <span className='hoverable widget'>
        <span className='hoverable-wrapper'>
          <Image {...this.props} className='hoverable-image' />
        </span>
        <Image {...this.props} />
        {this.props.children}
      </span>
    );
  }
}
