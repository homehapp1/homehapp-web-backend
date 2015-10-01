'use strict';

import React from 'react';
import { Link } from 'react-router';
import BigImage from './BigImage';
import LargeText from './LargeText';

export default class Neighborhood extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
    images: React.PropTypes.array.isRequired,
    coordinates: React.PropTypes.array
  };

  render() {
    let image = {
      src: 'images/content/content-placeholder.jpg',
      alt: ''
    };

    if (Array.isArray(this.props.images) && this.props.images.length) {
      image = this.props.images[0];
    }

    return (
      <BigImage image={image}>
        <LargeText align='center' valign='middle' className='full-height'>
          <p className='teaser'>...and about the neighbourhood</p>
          <h1>
            <Link to='neighborhoodsView' params={{city: 'london', neighborhood: this.props.slug}}>
              {this.props.title}
            </Link>
          </h1>
        </LargeText>
      </BigImage>
    );
  }
}
