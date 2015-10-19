

import React from 'react';
import BigImage from '../Widgets/BigImage';
import LargeText from '../Widgets/LargeText';

export default class ErrorPage extends React.Component {
  static propTypes = {
    children: React.PropTypes.object,
    title: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired,
    image: React.PropTypes.object,
    className: React.PropTypes.string,
    align: React.PropTypes.string,
    valign: React.PropTypes.string
  };

  static defaultProps = {
    className: '',
    image: {
      url: 'images/content/not-found.jpg',
      alt: 'Page not found',
      author: 'Ben Brooksbank',
      type: 'asset'
    },
    align: 'center',
    valign: 'middle'
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

    let proportion = (this.props.children) ? 0.8 : 1;

    return (
      <div className='widget'>
        <BigImage image={this.props.image} proportion={proportion} fixed align={this.props.align} valign={this.props.valign}>
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
