'use strict';

import React from 'react';
import { Link } from 'react-router';
import BigImage from './BigImage';
import LargeText from './LargeText';

class Neighborhood extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
    images: React.PropTypes.array.isRequired,
    coordinates: React.PropTypes.array
  };

  render() {
    console.log('neighborhood', this.props);
    let image = this.props.images[0];

    return (
      <BigImage image={image}>
        <LargeText align='center' valign='middle' className='full-height'>
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

export default Neighborhood;
