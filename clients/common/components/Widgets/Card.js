'use strict';

import React from 'react';
import { Link } from 'react-router';

import classNames from 'classnames';
import { formatPrice, primaryHomeTitle } from '../../../common/Helpers';

import Hoverable from './Hoverable';

class Card extends React.Component {
  static propTypes = {
    item: React.PropTypes.object.isRequired
  };

  mainImage() {
    if (!this.props.item.images.length) {
      return null;
    }

    let image = this.props.item.images[0];

    return (
      <span className='image-wrapper'>
        <Hoverable {...image} variant='card' />
      </span>
    );
  }

  render() {
    let classes = ['card'];

    if (this.props.item.story.enabled) {
      classes.push('storified');
    }

    let image = this.mainImage();

    return (
      <div className={classNames(classes)}>
        <div className='card-content'>
          <Link to='home' params={{slug: this.props.item.slug}} className='thumbnail'>
            {image}
            <span className='details'>
              <span className='price'>{formatPrice(this.props.item.costs.sellingPrice)}</span>
              <span className='street'>{this.props.item.location.address.street}, </span>
              <span className='city'>{this.props.item.location.address.city}</span>
            </span>
          </Link>
          <p className='title'>
            <Link to='home' params={{slug: this.props.item.slug}}>{primaryHomeTitle(this.props.item)}</Link>
          </p>
        </div>
      </div>
    );
  }
}

export default Card;
