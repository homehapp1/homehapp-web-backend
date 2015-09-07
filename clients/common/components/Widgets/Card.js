'use strict';

import React from 'react';
import { Link } from 'react-router';

import classNames from 'classnames';
import { formatPrice } from '../../../common/Helpers';

import Image from './Image';

class Card extends React.Component {
  render() {
    let classes = ['card'];

    if (item.story.enabled) {
      classes.push('storified');
    }

    return (
      <div className={classNames(classes)} key={index}>
        <div className='card-content'>
          <Link to='home' params={{slug: item.slug}} className='thumbnail'>
            {
              item.images.map((img, ind) => {
                if (ind) {
                  return null;
                }

                return (
                  <span className='image-wrapper' key={ind}>
                    <Image src={img.url} alt={img.alt} aspectRatio={img.aspectRatio} variant='card' />
                  </span>
                );
              })
            }
            <span className='details'>
              <span className='price'>{formatPrice(item.costs.sellingPrice)}</span>
              <span className='street'>{item.location.address.street}, </span>
              <span className='city'>{item.location.address.city}</span>
            </span>
          </Link>
          <p className='description'>
            <Link to='home' params={{slug: item.slug}}>{item.description}</Link>
          </p>
        </div>
      </div>
    );
  }
}

export default Card;
