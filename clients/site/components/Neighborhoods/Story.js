'use strict';

import React from 'react';
import { Link } from 'react-router';

import Gallery from '../../../common/components/Widgets/Gallery';
import BigImage from '../../../common/components/Widgets/BigImage';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Icon from '../../../common/components/Widgets/Icon';
import LargeText from '../../../common/components/Widgets/LargeText';

class NeighborhoodsStory extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired,
    neighborhood: React.PropTypes.object //.isRequired
  };

  static defaultProps = {
    neighborhood: {
      slug: 'stjohnswood',
      title: 'St. John\'s Wood',
      city: {
        title: 'London',
        slug: 'london'
      },
      images: [
        { url: 'v10/contentMockup/DSCF9306.jpg', alt: '', aspectRatio: 1.5179 },
        { url: 'v10/contentMockup/DSCF9257.jpg', alt: '', aspectRatio: 1.1567 },
        { url: 'v10/contentMockup/DSCF9261.jpg', alt: '', aspectRatio: 0.8682 },
        { url: 'v10/contentMockup/DSCF9280.jpg', alt: '', aspectRatio: 1.5 },
        { url: 'v10/contentMockup/DSCF9283.jpg', alt: '', aspectRatio: 1.4998 },
        { url: 'v10/contentMockup/DSCF9287.jpg', alt: '', aspectRatio: 1.1859 },
        // { url: 'v10/contentMockup/DSCF9293.jpg', alt: '', aspectRatio: 1.5401 },
        // { url: 'v10/contentMockup/DSCF9301.jpg', alt: '', aspectRatio: 0.9691 },
        // { url: 'v10/contentMockup/DSCF9307.jpg', alt: '', aspectRatio: 1.3606 },
        // { url: 'v10/contentMockup/DSCF9310.jpg', alt: '', aspectRatio: 1.4556 },
        // { url: 'v10/contentMockup/DSCF9328.jpg', alt: '', aspectRatio: 1.6685 },
        // { url: 'v10/contentMockup/DSCF9330.jpg', alt: '', aspectRatio: 1.5797 },
        // { url: 'v10/contentMockup/DSCF9332.jpg', alt: '', aspectRatio: 1.8638 },
        // { url: 'v10/contentMockup/DSCF9339.jpg', alt: '', aspectRatio: 1.2735 },
        { url: 'v10/contentMockup/DSCF9347.jpg', alt: '', aspectRatio: 0.9795 }
      ],
      description: 'St John\'s Wood is a district of north-west London, in the City of Westminster, and on the north-west side of Regent\'s Park. It is about 2.5 miles (4 km) north-west of Charing Cross. Once part of the Great Middlesex Forest, it was later owned by the Knights of St John of Jerusalem.\n\nIt is a very affluent neighbourhood, with the area postcode (NW8) ranked by Forbes magazine as the 5th most expensive postcode in London based on the average home price in 2007. According to a 2014 property agent survey, St. John\'s Wood residents pay the highest average rent in all of London.\n\nIn 2013, the price of housing in St John\'s Wood reached exceptional levels. Avenue Road had more than 10 large mansions/villas for sale. The most expensive had an asking price of £65 million, with the cheapest at £15 million. The remainder were around £25 mill.'
    }
  };

  render() {
    let neighborhood = this.props.neighborhood;
    let image = neighborhood.images[0];

    return (
      <div className='neighborhood-story'>
        <BigImage image={image} gradient='black' fixed={false}>
          <LargeText align='center' valign='middle'>
            <Icon type='marker' color='black' size='large' />
            <h1>{neighborhood.title}}</h1>
          </LargeText>
        </BigImage>

        <ContentBlock className='with-gradient padded'>
          <blockquote>{neighborhood.description}</blockquote>
          <p className='call-to-action'>
            <Link className='button' to='neighborhoodsViewHomes' params={{city: neighborhood.city.slug, neighborhood: neighborhood.slug}}>Show homes</Link>
          </p>
        </ContentBlock>
        <ContentBlock className='with-gradient'>
          <Gallery images={this.props.neighborhood.images} columns={5} imageWidth={300} fullscreen={true} className='tight' />
        </ContentBlock>
      </div>
    );
  }
}

export default NeighborhoodsStory;
