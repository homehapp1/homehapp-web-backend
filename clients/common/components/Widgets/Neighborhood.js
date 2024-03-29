import React from 'react';
import { Link } from 'react-router';
import BigImage from './BigImage';
import LargeText from './LargeText';

export default class Neighborhood extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
    images: React.PropTypes.array.isRequired,
    coordinates: React.PropTypes.array,
    className: React.PropTypes.string
  }

  static defaultProps = {
    className: null
  }

  render() {
    let image = {
      url: 'v1439564093/london-view.jpg',
      alt: ''
    };

    if (Array.isArray(this.props.images) && this.props.images.length) {
      image = this.props.images[0];
    }

    let classes = ['neighborhood'];

    return (
      <BigImage image={image} className={classes.join(' ')}>
        <LargeText align='center' valign='middle' className='full-height'>
          <p className='teaser'>...and about the neighbourhood</p>
          <h1>
            <Link to='neighborhoodView' params={{city: 'london', neighborhood: this.props.slug}}>
              {this.props.title}
            </Link>
          </h1>
        </LargeText>
      </BigImage>
    );
  }
}
