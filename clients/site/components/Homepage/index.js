'use strict';

import React from 'react';
import { Link } from 'react-router';

class Homepage extends React.Component {
  componentDidMount() {
    // Trigger the resize events defined in layout
    window.dispatchEvent(new Event('resize'));
  }

  render() {
    let images = {
      small: 'https://images.unsplash.com/photo-1428342628092-61f9e5d578f2?q=80&fm=jpg&s=82762926d328127b919301ae643d63ac',
      medium: 'https://images.unsplash.com/photo-1428342628092-61f9e5d578f2?q=80&fm=jpg&s=82762926d328127b919301ae643d63ac',
      large: 'https://images.unsplash.com/photo-1428342628092-61f9e5d578f2?q=80&fm=jpg&s=82762926d328127b919301ae643d63ac'
    };
    return (
      <div id='container' className='mainpage'>
        <div className='item big-image gradient full-height fixed'>
          <div className='image-content' data-vertical='middle'>
            <img alt='Live your dream' className='parallax-move show-for-large' src={images.small} />
            <img alt='Live your dream' className='parallax-move show-for-medium' src={images.medium} />
            <img alt='Live your dream' className='parallax-move show-for-small' src={images.large} />
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
      </div>
    );
  }
}

export default Homepage;
