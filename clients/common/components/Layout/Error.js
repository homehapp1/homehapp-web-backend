'use strict';

import React from 'react';
import BigImage from '../Widgets/BigImage';
import ContentBlock from '../Widgets/ContentBlock';
import LargeText from '../Widgets/LargeText';

class Error extends React.Component {
  static propTypes = {
    children: React.PropTypes.object,
    message: React.PropTypes.string.isRequired,
    image: React.PropTypes.object,
    className: React.PropTypes.string
  };

  static defaultProps = {
    className: '',
    image: {
      url: 'images/content/not-found.jpg',
      alt: 'Page not found',
      type: 'asset'
    }
  };

  render() {
    let classes = [
      'widget',
      'large-text',
      'full-height'
    ];

    if (this.props.className) {
      classes.push(this.props.className);
    }

    let props = {
      'data-align': this.props.align,
      'data-valign': this.props.valign
    };

    return (
      <div className='widget'>
        <BigImage image={this.props.image} proportion={0.9}>
          <LargeText align='center' valign='middle'><h1>{this.props.message}</h1></LargeText>
        </BigImage>
        {this.props.children}
      </div>
    );
  }
}

export default Error;
