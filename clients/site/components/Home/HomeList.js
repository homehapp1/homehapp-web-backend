/* global window */
'use strict';

import React from 'react';
import { Link } from 'react-router';

import Hoverable from '../../../common/components/Widgets/Hoverable';

let debug = require('../../../common/debugger')('HomeList');

export default class HomeList extends React.Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
    max: React.PropTypes.number,
    className: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ])
  };

  static defaultProps = {
    max: Infinity,
    className: null
  };

  getStreet(home) {
    if (home.location.address.street) {
      return (<span className='street'>{home.location.address.street}</span>);
    }
    return null;
  }

  getNeighborhood(home) {
    if (home.location.neighborhood && typeof home.location.neighborhood === 'object') {
      return (<span className='neighborhood'>{home.location.neighborhood.title}</span>);
    }
    return null;
  }
  getCity(home) {
    if (home.location.address.city) {
      return (<span className='neighborhood'>{home.location.address.city}</span>);
    }
    return null;
  }

  render() {
    debug('Render');
    let containerClass = ['home-list', 'preview-list'];

    if (this.props.className) {
      containerClass.push(this.props.className);
    }
    debug('Draw homes', this.props.items, this.props.max);

    return (
      <div className={containerClass.join(' ')} ref='homeList'>
        {this.props.children}
        {
          this.props.items.map((home, index) => {
            debug('Home', home.title);
            let classes = ['preview'];

            if (index === this.props.max) {
              classes.push('last');
            }

            if (!index) {
              classes.push('first');
            }

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

            let mainImage = {
              url: home.mainImage.url,
              alt: home.mainImage.alt
            };

            return (
              <div className={classes.join(' ')} key={index}>
                <Link {...link} className='thumbnail'>
                  <Hoverable {...mainImage} width={464} height={556} mode='fill' applySize>
                    <span className='title'>{home.homeTitle}</span>
                  </Hoverable>
                </Link>
                <div className='description'>
                  <p className='price'>{home.formattedPrice}</p>
                  <p className='address'>
                    {this.getStreet(home)}
                    {this.getNeighborhood(home)}
                    {this.getCity(home)}
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
