'use strict';

import React from 'react';
import { Link } from 'react-router';

import ApplicationStore from '../../../common/stores/ApplicationStore';
import PropertyCards from '../Property/Cards';
import { createProperty } from '../../../common/Helpers';

class Homepage extends React.Component {
  constructor() {
    super();
    this.config = ApplicationStore.getState().config;
  }
  componentDidMount() {
    // Trigger the resize events defined in layout
    window.dispatchEvent(new Event('resize'));
  }

  render() {
    let imageSrc = 'v1439564093/london-view.jpg';
    let images = {
      small: `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.small}/${imageSrc}`,
      medium: `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.medium}/${imageSrc}`,
      large: `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.large}/${imageSrc}`
    };
    // Populate fake properties
    let items = [];
    for (let i = 0; i < 20; i++) {
      items.push(createProperty(i));
    }

    return (
      <div id='mainpage' className='mainpage'>
        <div className='item big-image gradient full-height fixed'>
          <div className='image-content' data-vertical='middle'>
            <img alt='Live your dream' className='parallax-move show-for-large' src={images.large} />
            <img alt='Live your dream' className='parallax-move show-for-medium' src={images.medium} />
            <img alt='Live your dream' className='parallax-move show-for-small' src={images.small} />
          </div>
          <div className='width-wrapper'>
            <div className='large-text' data-vertical='center' data-align='center'>
              <div className='splash'>
                <h1>
                  <img className='symbol' src='/public/images/homehapp-symbol.svg' alt='' />
                  <img className='logotype' src='/public/images/homehapp-logotype.svg' alt='Homehapp' />
                </h1>
                <p><img className='slogan' src='/public/images/slogan-discovery.svg' alt='Discover y' /></p>
              </div>
            </div>
          </div>
        </div>
        <div className='property-list item'>
          <PropertyCards items={items} max={6} />
        </div>
      </div>
    );
  }
}

export default Homepage;
