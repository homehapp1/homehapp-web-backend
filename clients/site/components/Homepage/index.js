'use strict';

import React from 'react';
import { Link } from 'react-router';

class Homepage extends React.Component {
  render() {
    return (
      <div id='container'>
        <div className='item big-image fixed ng-scope full-height'>
          <div className='image-content ng-scope'>
            <img alt='Live your dream' className='parallax-move show-for-large' src='//res.cloudinary.com/kaktus/image/upload/c_scale,q_60,w_1920/v1436955483/DSCF9157_bsxil9.jpg' />
            <img alt='Live your dream' className='parallax-move show-for-medium' src='//res.cloudinary.com/kaktus/image/upload/c_scale,q_60,w_1000/v1436955483/DSCF9157_bsxil9.jpg' />
            <img alt='Live your dream' className='parallax-move show-for-small' src='//res.cloudinary.com/kaktus/image/upload/c_scale,q_60,w_600/v1436955483/DSCF9157_bsxil9.jpg' />
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
