'use strict';

import React from 'react';
import { Link } from 'react-router';
// import Tabs from 'react-simpletabs';

import HomeListStore from '../../stores/HomeListStore';
import ErrorPage from '../../../common/components/Layout/ErrorPage';

import PropertyList from '../Property/List';

import BigImage from '../../../common/components/Widgets/BigImage';
import Columns from '../../../common/components/Widgets/Columns';
import Hoverable from '../../../common/components/Widgets/Hoverable';
import Image from '../../../common/components/Widgets/Image';
import LargeText from '../../../common/components/Widgets/LargeText';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Loading from '../../../common/components/Widgets/Loading';
import { setPageTitle } from '../../../common/Helpers';

export default class Homepage extends React.Component {
  constructor() {
    super();
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    homes: HomeListStore.getState().homes
  };

  componentDidMount() {
    // Trigger the resize events defined in layout
    window.dispatchEvent(new Event('resize'));
    document.getElementsByTagName('body')[0].setAttribute('data-handler', 'homepage');

    HomeListStore.listen(this.storeListener);
    HomeListStore.fetchHomes({limit: 20});
    setPageTitle('Discover y');
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].removeAttribute('data-handler');
    HomeListStore.unlisten(this.storeListener);
    setPageTitle();
  }

  onChange(state) {
    this.setState(state);
  }

  handlePendingState() {
    return (
      <Loading>
        <p>Loading content...</p>
      </Loading>
    );
  }

  handleErrorState() {
    let error = {
      title: 'Error loading homes!',
      message: this.state.error.message
    };

    return (
      <ErrorPage {...error} />
    );
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }

    // if (HomeListStore.isLoading() || !this.state.homes.length) {
    //   return this.handlePendingState();
    // }

    let mainImage = {
      url: 'v1439564093/london-view.jpg',
      alt: ''
    };

    let images = [
      { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9094.jpg', alt: '', aspectRatio: 0.8443 },
      { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9096.jpg', alt: '', aspectRatio: 2.1757 },
      { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9097.jpg', alt: '', aspectRatio: 1 },
      { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9102.jpg', alt: '', aspectRatio: 1.8448 },
      { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9103.jpg', alt: '', aspectRatio: 2.1683 },
      { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9104.jpg', alt: '', aspectRatio: 0.763 },
      { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9108.jpg', alt: '', aspectRatio: 1.6141 },
      { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9136.jpg', alt: '', aspectRatio: 1 },
      { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9139.jpg', alt: '', aspectRatio: 1.1116 },
      { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9140.jpg', alt: '', aspectRatio: 0.7938 },
      { url: 'https://res.cloudinary.com/homehapp/image/upload/v10/contentMockup/DSCF9141.jpg', alt: '', aspectRatio: 1.5 }
    ];

    let neighborhoods = [
      {
        title: 'St. John`s Wood',
        slug: 'st_johns_wood',
        images: [images[0]]
      },
      {
        title: 'West End',
        slug: 'westend',
        images: [images[1]]
      },
      {
        title: 'China Town',
        slug: 'china_town',
        images: [images[2]]
      },
      {
        title: 'The City',
        slug: 'the_city',
        images: [images[4]]
      }
    ];

    let partnerImage = {
      src: 'http://res.cloudinary.com/homehapp/image/upload/v1442998167/site/images/content/tablelamp.jpg',
      alt: '',
      width: 424,
      height: 515
    };

    return (
      <div id='mainpage' className='mainpage'>
        <BigImage gradient='green' fixed image={mainImage} proportion={0.8}>
          <LargeText align='center' valign='middle' proportion={0.8}>
            <div className='splash'>
              <h1>Every home has<br /> a unique story</h1>
            </div>
          </LargeText>
        </BigImage>
        <div className='mainpage-list clearfix'>
          <PropertyList items={this.state.homes} max={3} className='mainpage-list short-list'>
            <h2>Exclusively for Homehapp</h2>
          </PropertyList>
          <p className='call-to-action'>
            <Link to='properties' className='button'>Find more</Link>
          </p>
        </div>
        <ContentBlock className='with-gradient'>
          <div className='center'>
            <hr className='spacer' />
            <Image {...mainImage} width={970} />
            <hr className='spacer' />
          </div>
          <h2 className='block-title'>Partner with us</h2>
          <Columns cols={4} className='table important' align='center' valign='middle'>
            <div className='span1'></div>
            <div className='span5 centered'>
              <p>
                <em>Become a service provider in Homehapp. We are looking for estate agents partners, legals, home decor...</em>
              </p>
              <p>
                <Link to='partners' className='button white'>Contact</Link>
              </p>
            </div>
            <div className='span5 centered'>
              <Image {...partnerImage} />
            </div>
            <div className='span1'></div>
          </Columns>
        </ContentBlock>
        <div className='mainpage-list clearfix with-gradient widget'>
          <div className='neighborhood-list preview-list short-list' ref='neighborhoodList'>
            <h2>Where is your home</h2>
            {
              neighborhoods.map((neighborhood, index) => {
                let image = (neighborhood.images && neighborhood.images[0]) ? neighborhood.images[0] : null;
                return (
                  <div className='preview' key={index}>
                    <Hoverable {...image} width={464} height={556} mode='fill' applySize>
                      <div className='neighborhood-title'>
                        <div className='wrapper'>
                          <Link to='neighborhoodView' params={{city: 'london', neighborhood: neighborhood.slug}}>
                            <span className='title'>{neighborhood.title}</span>
                          </Link>
                        </div>
                      </div>

                      <div className='actions'>
                        <Link to='neighborhoodView' params={{city: 'london', neighborhood: neighborhood.slug}}>
                          Read About
                        </Link>
                        <Link to='neighborhoodViewHomes' params={{city: 'london', neighborhood: neighborhood.slug}}>
                          Show Homes
                        </Link>
                      </div>
                    </Hoverable>
                  </div>
                );
              })
            }

            <p className='call-to-action'>
              <Link to='properties' className='button'>Find more</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
