'use strict';

import React from 'react';
import ApplicationStore from '../../../common/stores/ApplicationStore';
import Gallery from '../../../common/components/Gallery';
//import { Link } from 'react-router';

class NeighborhoodsStory extends React.Component {
  constructor() {
    super();
    this.config = ApplicationStore.getState().config;
    this.columns = 0;
  }

  render() {
    let imageSrc = 'v1439796794/contentMockup/DSCF9301.jpg';
    let images = {
      small: `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.small}/${imageSrc}`,
      medium: `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.medium}/${imageSrc}`,
      large: `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.large}/${imageSrc}`
    };
    return (
      <div className='neighborhood-story'>
        <div className='item big-image full-height fixed' data-gradient='black'>
          <div className='image-content'>
            <img alt='Live your dream' className='parallax-move show-for-large' src={images.large} />
            <img alt='Live your dream' className='parallax-move show-for-medium' src={images.medium} />
            <img alt='Live your dream' className='parallax-move show-for-small' src={images.small} />
          </div>
          <div className='width-wrapper full-height'>
            <div className='large-text' data-vertical='center' data-align='center'>
              <h1>St. John's wood</h1>
            </div>
          </div>
        </div>

        <div className='content-block item'>
          <div className='width-wrapper'>
            <blockquote>
              <p>
                St John's Wood is a district of north-west London, in the City of Westminster, and on the north-west side of Regent's Park. It is about 2.5 miles (4 km) north-west of Charing Cross. Once part of the Great Middlesex Forest, it was later owned by the Knights of St John of Jerusalem.
              </p>
              <p>
                It is a very affluent neighbourhood, with the area postcode (NW8) ranked by Forbes magazine as the 5th most expensive postcode in London based on the average home price in 2007. According to a 2014 property agent survey, St. John's Wood residents pay the highest average rent in all of London.
              </p>
              <p>
                In 2013, the price of housing in St John's Wood reached exceptional levels. Avenue Road had more than 10 large mansions/villas for sale. The most expensive had an asking price of £65 million, with the cheapest at £15 million. The remainder were around £25 mill.
              </p>
            </blockquote>
          </div>
        </div>

        <Gallery>
          <img src={images.medium} alt='' id='g1' />
          <img src={images.medium} alt='' id='g2' />
          <img src={images.medium} alt='' id='g3' />
          <img src={images.medium} alt='' id='g4' />
          <img src={images.medium} alt='' id='g5' />
        </Gallery>
      </div>
    );
  }
}

export default NeighborhoodsStory;
