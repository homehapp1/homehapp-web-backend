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
      <div id='container'>
        <div className='item big-image full-height'>
          <div className='image-content' data-vertical='middle'>
            <img alt='Live your dream' className='parallax-move show-for-large' src={images.small} />
            <img alt='Live your dream' className='parallax-move show-for-medium' src={images.medium} />
            <img alt='Live your dream' className='parallax-move show-for-small' src={images.large} />
          </div>
          <div className='width-wrapper'>
            <div className='widget large-text' data-vertical='center' data-align='center'>
              <div>
                <h1>Homehapp</h1>
                <p>Discover Y</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Homepage;
