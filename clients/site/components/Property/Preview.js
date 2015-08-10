/* global window */
'use strict';

// PropertyPreview

import React from 'react';
import { Link } from 'react-router';
import ApplicationStore from '../../../common/stores/ApplicationStore';

class PropertyPreview extends React.Component {
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
      <div ref='PropertyPreview' className='property-preview'>
      {
        this.props.items.map((item, index) => {
          let src = `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.propList}/${item.images[0]}`;

          return (
            <div className='property-list-item' key={index}>
              <div className='content'>
                <Link to='home' params={{slug: item.slug}} className='thumbnail'>
                  <img src={src} />
                </Link>
                <div className='details'>
                  <p className='address'>
                    <span className='street'>{item.address.street}</span>
                    <span className='city'>{item.address.city}</span>
                    <span className='country'>{item.address.country}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })
      }
      </div>
    );
  }
}

export default PropertyPreview;
