/* global window */
'use strict';

// PropertyList

import React from 'react';
import { Link } from 'react-router';
import ApplicationStore from '../../../common/stores/ApplicationStore';

class PropertyList extends React.Component {
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
    let style = {
      //width: `${this.props.width}px`
    };

    let classes = this.classes;

    return (
      <div ref='PropertyRow' className='property-list'>
      {
        this.props.items.map((item, index) => {
          let heights = [250, 300, 340, 380, 420, 450, 460, 500, 520, 540, 560, 600, 610];
          let seed = Math.floor(Math.random() * heights.length);
          let h = heights[seed];

          let src = `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.propList}/${item.images[0]}`;
          console.log('this.config', this.config);

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

export default PropertyList;
