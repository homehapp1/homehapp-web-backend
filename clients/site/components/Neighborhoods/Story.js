'use strict';

import React from 'react';
import ApplicationStore from '../../../common/stores/ApplicationStore';
import Gallery from '../../../common/components/Widgets/Gallery';
import BigImage from '../../../common/components/Widgets/BigImage';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';

class NeighborhoodsStory extends React.Component {
  constructor() {
    super();
    this.config = ApplicationStore.getState().config;
    this.columns = 0;
  }

  render() {
    let galleryImages = ['v1439796815/contentMockup/DSCF9347.jpg', 'v1439796815/contentMockup/DSCF9253.jpg', 'v1439796812/contentMockup/DSCF9310.jpg', 'v1439796810/contentMockup/DSCF9299.jpg', 'v1439796803/contentMockup/DSCF9261.jpg', 'v1439796800/contentMockup/DSCF9339.jpg', 'v1439796799/contentMockup/DSCF9328.jpg', 'v1439796797/contentMockup/DSCF9272.jpg', 'v1439796794/contentMockup/DSCF9301.jpg', 'v1439796791/contentMockup/DSCF9188.jpg', 'v1439796791/contentMockup/DSCF9306.jpg', 'v1439796791/contentMockup/DSCF9280.jpg', 'v1439796780/contentMockup/DSCF9257.jpg', 'v1439796776/contentMockup/DSCF9245.jpg', 'v1439796775/contentMockup/DSCF9201.jpg', 'v1439796764/contentMockup/DSCF9227.jpg', 'v1439796763/contentMockup/DSCF9111.jpg', 'v1439796759/contentMockup/DSCF9158.jpg', 'v1439796753/contentMockup/DSCF9225.jpg', 'v1439796748/contentMockup/DSCF9144.jpg', 'v1439796743/contentMockup/DSCF9178.jpg', 'v1439796741/contentMockup/DSCF9156.jpg', 'v1439796733/contentMockup/DSCF9177.jpg', 'v1439796732/contentMockup/DSCF9160.jpg', 'v1439796719/contentMockup/DSCF9102.jpg', 'v1439796718/contentMockup/DSCF9155.jpg', 'v1439796708/contentMockup/DSCF9141.jpg', 'v1439796701/contentMockup/DSCF9097.jpg', 'v1439796699/contentMockup/DSCF9095.jpg', 'v1439796693/contentMockup/DSCF9108.jpg', 'v1439796687/contentMockup/DSCF9105.jpg', 'v1439796684/contentMockup/DSCF9103.jpg'];
    let imageSrc = galleryImages[0];

    let shuffle = function(arr) {
      let currentIndex = arr.length, temporaryValue, randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
      }

      return arr;
    };

    galleryImages = shuffle(galleryImages).splice(0, 10);

    return (
      <div className='neighborhood-story'>
        <BigImage src={imageSrc} gradient='black' fixed={true}>
          <div className='large-text' data-vertical='center' data-align='center'>
            <h1>St. John's wood</h1>
          </div>
        </BigImage>

        <ContentBlock>
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
        </ContentBlock>

        <Gallery>
          {
            // {
            //   this.props.items.map((item, index) => {
            galleryImages.map((item, index) => {
              //${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.large}/${imageSrc}
              let src = `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.medium}/${item}`;
              return (
                <img src={src} alt='' key={index} />
              );
            })
          }
        </Gallery>
      </div>
    );
  }
}

export default NeighborhoodsStory;
