'use strict';

import React from 'react';
import { Link } from 'react-router';
import Tabs from 'react-simpletabs';

import HomeListStore from '../../stores/HomeListStore';
import ErrorPage from '../../../common/components/Layout/ErrorPage';

import BigImage from '../../../common/components/Widgets/BigImage';
import Columns from '../../../common/components/Widgets/Columns';
import Hoverable from '../../../common/components/Widgets/Hoverable';
import Image from '../../../common/components/Widgets/Image';
import LargeText from '../../../common/components/Widgets/LargeText';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Loading from '../../../common/components/Widgets/Loading';

import { formatPrice } from '../../../common/Helpers';

export default class Homepage extends React.Component {
  constructor() {
    super();
    this.storeListener = this.onChange.bind(this);
  }

  componentDidMount() {
    // Trigger the resize events defined in layout
    window.dispatchEvent(new Event('resize'));
    document.getElementsByTagName('body')[0].setAttribute('data-handler', 'homepage');

    HomeListStore.listen(this.storeListener);
    HomeListStore.fetchHomes({limit: 20});
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].removeAttribute('data-handler');
    HomeListStore.unlisten(this.storeListener);
  }

  state = {
    error: null,
    homes: HomeListStore.getState().homes
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

    let homes = this.state.homes.splice(0, 4);

    return (
      <div id='mainpage' className='mainpage'>
        <BigImage gradient='green' fixed={true} image={mainImage} proportion={0.9}>
          <LargeText align='center' valign='middle' proportion={0.9}>
            <div className='splash'>
              <h1>Every home has<br /> a unique story</h1>
            </div>
          </LargeText>
        </BigImage>
        <div className='mainpage-list clearfix'>
          <h2>Exclusively for Homehapp</h2>
          <div className='home-list' ref='homeList'>
            {
              homes.map((home, index) => {
                if (index > 3) {
                  return null;
                }

                let link = {
                  to: 'home',
                  params: {
                    slug: home.slug
                  }
                };
                let rooms = 0;

                for (let i = 0; i < home.attributes.length; i++) {
                  if (home.attributes[i].name !== 'rooms') {
                    continue;
                  }

                  rooms = home.attributes[i].value;
                  break;
                }

                if (rooms === 1) {
                  rooms = `${rooms} bedroom`;
                } else {
                  rooms = `${rooms} bedrooms`;
                }

                let price = home.costs.sellingPrice;

                return (
                  <div className='home-preview' key={index}>
                    <Link {...link}>
                      <Hoverable {...home.images[0]} width={464} height={556} mode='fill' applySize={true}>
                        <span className='title'>{home.homeTitle}</span>
                      </Hoverable>
                    </Link>
                    <div className='description'>
                      <p className='price'>{formatPrice(price)}</p>
                      <p className='address'>
                        <span className='street'>{home.location.address.street}</span>
                        <span className='neighborhood'>{home.location.neighborhood.title}</span>
                        <span className='city'>{home.location.address.city}</span>
                      </p>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
        <ContentBlock className='item-separator with-gradient'>
          <h2>Find your home and continue the story</h2>
          <p>Homehapp stands for dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
          <iframe src='https://player.vimeo.com/video/74145280' width='100%' height='550' frameBorder='0' webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe>
        </ContentBlock>
        <ContentBlock className='with-gradient'>
          <Tabs>
            <Tabs.Panel title='Homehapp for buyers'>
              <Columns cols={2} className='table' align='center' valign='middle'>
                <Image src='images/icons/icon_mobile_large.svg' alt='' type='asset' />
                <div className='highlight'>
                  <p>
                    Homehapp stands for dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </div>
              </Columns>
            </Tabs.Panel>
            <Tabs.Panel title='For sellers and agents'>
              <div className='highlight'>
                <p>
                  Homehapp stands for dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </Tabs.Panel>
          </Tabs>
        </ContentBlock>
        <ContentBlock className='with-gradient'>
          <Columns cols={2} className='table find-agents' align='center' valign='middle'>
            <div className='highlight centered'>
              <p>Find agents. Professionals will help you in telling your view of your home.</p>
              <p>
                <a href='#' className='button'>Find agents</a>
              </p>
            </div>
            <div className='right'>
              <Image src='images/pixel.gif' alt='' type='asset' className='placeholder' />
            </div>
          </Columns>
        </ContentBlock>
      </div>
    );
  }
}
