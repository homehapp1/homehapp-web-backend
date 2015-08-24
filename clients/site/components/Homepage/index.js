'use strict';

import React from 'react';
import { Link } from 'react-router';

import ApplicationStore from '../../../common/stores/ApplicationStore';

import HomeListStore from '../../stores/HomeListStore';

import PropertyCards from '../Property/Cards';
import BigImage from '../../../common/components/Widgets/BigImage';
import LargeText from '../../../common/components/Widgets/LargeText';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';

class Homepage extends React.Component {
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
      <div className='homes-loader'>
        <div className='width-wrapper'>
          <h3>Loading homes...</h3>
        </div>
      </div>
    );
  }

  handleErrorState() {
    return (
      <div className='homes-error'>
        <h3>Error loading homes!</h3>
        <p>{this.state.error.message}</p>
      </div>
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

    return (
      <div id='mainpage' className='mainpage'>
        <BigImage gradient='green' fixed={true} image={mainImage} proportion={0.7}>
          <LargeText align='center' vertical='center'>
            <div className='splash'>
              <h1>Every home has a unique story</h1>
            </div>
          </LargeText>
        </BigImage>
        <div className='item property-list partial-list'>
          <PropertyCards items={this.state.homes} max={20} />
          <Link to='properties' className='button read-more'>View more</Link>
        </div>
        <ContentBlock className='item-separator'>
          <h2>Find your home and continue the story</h2>
          <p>Homehapp stands for dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
          <iframe src='https://player.vimeo.com/video/74145280' width='100%' height='550' frameBorder='0' webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe>
          <h2>Find your home and continue the story</h2>
          <p>Homehapp stands for dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
          <iframe src='https://player.vimeo.com/video/74145280' width='100%' height='550' frameBorder='0' webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe>
        </ContentBlock>
      </div>
    );
  }
}

export default Homepage;
