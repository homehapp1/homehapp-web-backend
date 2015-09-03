'use strict';

import React from 'react';
import BigImage from '../Widgets/BigImage';
import ContentBlock from '../Widgets/ContentBlock';
import LargeText from '../Widgets/LargeText';

class ErrorPage extends React.Component {
  static propTypes = {
    children: React.PropTypes.object,
    title: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired,
    image: React.PropTypes.object,
    className: React.PropTypes.string
  };

  static defaultProps = {
    className: '',
    image: {
      url: 'images/content/not-found.jpg',
      alt: 'Page not found',
      author: 'Ben Brooksbank',
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

    let proportion = (this.props.children) ? 0.8 : 1;

    return (
      <div className='widget'>
        <BigImage image={this.props.image} proportion={proportion} fixed={true}>
          <LargeText align='center' valign='middle' proportion={proportion}>
            <h1>{this.props.title}</h1>
            <p>{this.props.message}</p>
          </LargeText>
        </BigImage>
        {this.props.children}
      </div>
    );
  }
}

export default ErrorPage;
