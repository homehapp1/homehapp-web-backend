/* global window */
'use strict';

// PropertyList

import React from 'react';
import { Link } from 'react-router';
import ApplicationStore from '../../../common/stores/ApplicationStore';
import PropertyDetail from './Detail';

export default class PropertyList extends React.Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired
  }

  constructor() {
    super();
    this.config = ApplicationStore.getState().config;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div ref='PropertyList' className='property-list width-wrapper'>
      {
        this.props.items.map((item, index) => {
          let src = `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.propList}/${item.images[0]}`;

          return (
            <div className='property-list-item' key={index}>
              <Link to='home' params={{slug: item.slug}} className='thumbnail'>
                <img src={src} />
              </Link>
              <div className='details'>
                <h3 className='address'>
                  <span className='street'>{item.address.street}</span>
                  <span className='city'>{item.address.city}</span>
                  <span className='country'>{item.address.country}</span>
                </h3>
                <p className='price'>
                  £{item.price.toFixed(1)}M
                </p>
                <div className='details'>
                  <PropertyDetail label='Construction type' values={item.construction} />
                  <PropertyDetail label='Exterior' values={item.exterior} />
                  <PropertyDetail label='Style of home' values={item.style} />
                  <PropertyDetail label='Roof' values={item.roof} />
                  <PropertyDetail label='Yard amenities' values={item.yard} />
                  <PropertyDetail label='Flooring' values={item.flooring} />
                  <PropertyDetail label='Energy features' values={item.energy} />
                  <PropertyDetail label='Disability features' values={item.disabilityFeatures} />
                </div>

                <ul className='thumbnails'>
                  {
                    item.images.map((img) => {
                      let thumbSrc = `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.pinkyNail}/${img}`;
                      return (
                        <li>
                          <Link to='home' params={{slug: item.slug}}><img src={thumbSrc} /></Link>
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
            </div>
          );
        })
      }
      </div>
    );
  }
}
