'use strict';

import React from 'react';
import { Link } from 'react-router';

// Widgets
import BigImage from '../../../common/components/Widgets/BigImage';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Image from '../../../common/components/Widgets/Image';
import LargeText from '../../../common/components/Widgets/LargeText';

import { setPageTitle } from '../../../common/Helpers';

export default class NeighborhoodsList extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    setPageTitle(`Neighbourhoods of ${this.city.substr(0, 1).toUpperCase()}${this.city.substr(1)}`);
  }

  componentWillUnmount() {
    setPageTitle();
  }

  render() {
    let image = {
      src: 'images/content/london-view.jpg',
      alt: 'London Cityscape',
      author: 'Steve Cadman',
      type: 'asset'
    };

    let neighborhoods = [
      {
        slug: 'lancaster',
        title: 'Lancaster Gate',
        image: {
          src: 'v1440156847/contentMockup/DSCF9283.jpg',
          alt: ''
        }
      },
      {
        slug: 'lancaster',
        title: 'Lorem ipsum',
        image: {
          src: 'v1440156847/contentMockup/DSCF9283.jpg',
          alt: ''
        }
      }
    ];

    this.city = 'london';

    if (typeof this.props.params !== 'undefined' && typeof this.props.params.city !== 'undefined') {
      this.city = this.props.params.city;
    }

    return (
      <div className='neighborhood-list-container'>
        <BigImage image={image}>
          <LargeText align='center' valign='middle'>
            <h1>Neighbourhoods of London</h1>
          </LargeText>
        </BigImage>
        <ContentBlock className='neighborhoods-list'>
          {
            neighborhoods.map((item, index) => {
              return (
                <div className='neighborhood' key={index}>
                  <Link className='image-wrapper' to='neighborhoodsView' params={{city: this.city, neighborhood: item.slug}}>
                    <Image {...item.image} width={1200} height={680} mode='fill' />
                  </Link>
                  <ContentBlock valign='center'>
                    <h2 className='block-title'>
                      <Link to='neighborhoodsView' params={{city: this.city, neighborhood: item.slug}}>
                        {item.title}
                      </Link>
                    </h2>
                    <ul className='buttons'>
                      <li>
                        <Link to='neighborhoodsView' params={{city: this.city, neighborhood: item.slug}}>
                          Read about
                        </Link>
                      </li>
                      <li>Show homes</li>
                    </ul>
                  </ContentBlock>
                </div>
              );
            })
          }
        </ContentBlock>
      </div>
    );
  }
}
