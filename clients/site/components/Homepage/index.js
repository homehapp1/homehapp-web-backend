'use strict';

import React from 'react';
import { Link } from 'react-router';
// import Tabs from 'react-simpletabs';

import HomeListStore from '../../stores/HomeListStore';
import ErrorPage from '../../../common/components/Layout/ErrorPage';

import HomeList from '../Home/HomeList';

import BigImage from '../../../common/components/Widgets/BigImage';
import Columns from '../../../common/components/Widgets/Columns';
import Hoverable from '../../../common/components/Widgets/Hoverable';
import Image from '../../../common/components/Widgets/Image';
import LargeText from '../../../common/components/Widgets/LargeText';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Loading from '../../../common/components/Widgets/Loading';
import { setPageTitle } from '../../../common/Helpers';

let debug = require('../../../common/debugger')('Homepage');

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
    HomeListStore.fetchHomes();
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

    let placeholder = {
      url: 'https://res.cloudinary.com/homehapp/image/upload/v1439564093/london-view.jpg',
      alt: ''
    };

    let neighborhoods = [];
    for (let home of this.state.homes) {
      let neighborhood = home.location.neighborhood;
      if (!neighborhood) {
        continue;
      }

      if (neighborhoods.indexOf(neighborhood) === -1) {
        neighborhoods.push(neighborhood);
      }
    }

    debug('Neighborhoods', neighborhoods);

    let partnerImage = {
      src: 'https://res.cloudinary.com/homehapp/image/upload/v1442998167/site/images/content/tablelamp.jpg',
      alt: '',
      width: 424,
      height: 515
    };

    return (
      <div id='mainpage' className='mainpage'>
        <BigImage gradient='green' fixed image={placeholder} proportion={0.8}>
          <LargeText align='center' valign='middle' proportion={0.8}>
            <div className='splash'>
              <h1>Every home has<br /> a unique story</h1>
            </div>
          </LargeText>
        </BigImage>
        <div className='mainpage-list clearfix'>
          <HomeList items={this.state.homes} max={4} className='mainpage-list short-list'>
            <h2>Exclusively for Homehapp</h2>
          </HomeList>
          <p className='call-to-action'>
            <Link to='search' className='button'>Find more</Link>
          </p>
        </div>
        <ContentBlock className='with-gradient'>
          <div className='center'>
            <hr className='spacer' />
            <Image {...placeholder} width={970} />
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
                if (index >= 4) {
                  return null;
                }

                return (
                  <div className='preview' key={index}>
                    <Hoverable {...neighborhood.mainImage} width={464} height={556} mode='fill' applySize>
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
              <Link to='search' className='button'>Find more</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
