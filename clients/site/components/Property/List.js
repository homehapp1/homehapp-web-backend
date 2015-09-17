/* global window */
'use strict';

// PropertyList

import React from 'react';
import { Link } from 'react-router';

import Hoverable from '../../../common/components/Widgets/Hoverable';
import { formatPrice } from '../../../common/Helpers';

export default class PropertyList extends React.Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
    max: React.PropTypes.number
  };

  static defaultProps = {
    max: Infinity
  };

  render() {
    console.log('PropertyList', this.props.items);
    return (
      <div className='home-list' ref='homeList'>
      {
        this.props.items.map((home, index) => {
          if (index > this.props.max) {
            return null;
          }

          let link = {
            to: 'home',
            params: {
              slug: home.slug
            }
          };
          let rooms = 0;

          for (let i = 0; i < home.attributes.length; i++) {
            if (home.attributes[i].name !== 'rooms') {
              continue;
            }

            rooms = home.attributes[i].value;
            break;
          }

          if (rooms === 1) {
            rooms = `${rooms} bedroom`;
          } else {
            rooms = `${rooms} bedrooms`;
          }

          let price = home.costs.sellingPrice;
          let classes = ['preview'];

          return (
            <div className={classes.join(' ')} key={index}>
              <Link {...link}>
                <Hoverable {...home.images[0]} width={464} height={556} mode='fill' applySize={true}>
                  <span className='title'>{home.homeTitle}</span>
                </Hoverable>
              </Link>
              <div className='description'>
                <p className='price'>{formatPrice(price)}</p>
                <p className='address'>
                  <span className='street'>{home.location.address.street}</span>
                  <span className='neighborhood'>{home.location.neighborhood.title}</span>
                  <span className='city'>{home.location.address.city}</span>
                </p>
              </div>
            </div>
          );
        })
      }
      </div>
    );
  }
}
