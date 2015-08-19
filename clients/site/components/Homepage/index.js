'use strict';

import React from 'react';
import { Link } from 'react-router';

import ApplicationStore from '../../../common/stores/ApplicationStore';
import { createProperty } from '../../../common/Helpers';

import PropertyCards from '../Property/Cards';
import BigImage from '../../../common/components/Widgets/BigImage';
import LargeText from '../../../common/components/Widgets/LargeText';

class Homepage extends React.Component {
  constructor() {
    super();
    this.config = ApplicationStore.getState().config;
  }

  componentDidMount() {
    // Trigger the resize events defined in layout
    window.dispatchEvent(new Event('resize'));
    document.getElementsByTagName('body')[0].setAttribute('data-handler', 'homepage');
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].removeAttribute('data-handler');
  }

  render() {
    // Populate fake properties
    let items = [];
    for (let i = 0; i < 20; i++) {
      items.push(createProperty(i));
    }

    return (
      <div id='mainpage' className='mainpage'>
        <BigImage gradient='green' fixed={true} src='v1439564093/london-view.jpg'>
          <LargeText align='center' vertical='center'>
            <div className='splash'>
              <h1>
                <img className='symbol' src='/public/images/homehapp-symbol.svg' alt='' />
                <img className='logotype' src='/public/images/homehapp-logotype.svg' alt='Homehapp' />
              </h1>
              <p><img className='slogan' src='/public/images/slogan-discovery.svg' alt='Discover y' /></p>
            </div>
          </LargeText>
        </BigImage>
        <div className='item property-list partial-list'>
          <PropertyCards items={items} max={12} />
          <Link to='properties' className='button read-more'>View more</Link>
        </div>
        <div className='item content-block item-separator'>
          <div className='width-wrapper'>
            <h2>Find your home and continue the story</h2>
            <p>Homehapp stands for dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
            <iframe src='https://player.vimeo.com/video/74145280' width='100%' height='550' frameBorder='0' webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe>
            <h2>Find your home and continue the story</h2>
            <p>Homehapp stands for dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
            <iframe src='https://player.vimeo.com/video/74145280' width='100%' height='550' frameBorder='0' webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe>
          </div>
        </div>
      </div>
    );
  }
}

export default Homepage;
