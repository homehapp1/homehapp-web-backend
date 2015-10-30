import React from 'react';
import { Link } from 'react-router';
// import Tabs from 'react-simpletabs';

import HomeListStore from '../../stores/HomeListStore';
import HomeList from '../Home/HomeList';

import NeighborhoodListStore from '../../stores/NeighborhoodListStore';

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
    this.homeStoreListener = this.onHomeListChange.bind(this);
    this.neighborhoodStoreListener = this.onNeighborhoodListChange.bind(this);
  }

  state = {
    error: null,
    homes: HomeListStore.getState().items,
    neighborhoods: NeighborhoodListStore.getState().items
  }

  componentDidMount() {
    // Trigger the resize events defined in layout
    window.dispatchEvent(new Event('resize'));
    document.getElementsByTagName('body')[0].setAttribute('data-handler', 'homepage');

    HomeListStore.listen(this.homeStoreListener);
    NeighborhoodListStore.listen(this.neighborhoodStoreListener);
    HomeListStore.fetchItems({limit: 4});
    NeighborhoodListStore.fetchItems({limit: 4});

    setPageTitle('Discover y');
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].removeAttribute('data-handler');
    HomeListStore.unlisten(this.homeStoreListener);
    NeighborhoodListStore.unlisten(this.neighborhoodStoreListener);
    setPageTitle();
  }

  onHomeListChange(state) {
    debug('onHomeListChange', state);
    this.setState({
      status: state.error,
      homes: state.items
    });
  }

  onNeighborhoodListChange(state) {
    debug('onNeighborhoodListChange', state);
    this.setState({
      status: state.error,
      neighborhoods: state.items
    });
  }

  handlePendingState() {
    return (
      <Loading>
        <p>Loading content...</p>
      </Loading>
    );
  }

  renderHomeList(homes) {
    if (!homes || !homes.length) {
      return null;
    }

    return (
      <div className='mainpage-list clearfix'>
        <HomeList items={homes} max={4} className='mainpage-list short-list'>
          <h2>Exclusively for Homehapp</h2>
        </HomeList>
        <p className='call-to-action'>
          <Link to='search' className='button'>Find more</Link>
        </p>
      </div>
    );
  }

  renderNeighborhoods(neighborhoods) {
    if (!neighborhoods || !neighborhoods.length) {
      return null;
    }
    let counter = 0;
    return (
      <div className='mainpage-list clearfix with-gradient widget'>
        <div className='neighborhood-list preview-list short-list' ref='neighborhoodList'>
          <h2>Where is your home</h2>
          <div className='list-container'>
            {
              neighborhoods.map((neighborhood, index) => {
                if (counter >= 6) {
                  return null;
                }

                if (!neighborhood) {
                  return null;
                }
                counter++;

                return (
                  <div className='preview' key={index}>
                    <Hoverable {...neighborhood.mainImage} width={464} height={556} mode='fill' applySize className='with-shadow'>
                      <div className='title'>
                        <div className='wrapper'>
                          <Link to='neighborhoodView' params={{city: 'london', neighborhood: neighborhood.slug}}>
                            {neighborhood.title}
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
          </div>

          <p className='call-to-action'>
            <Link to='neighborhoodList' params={{city: 'london'}} className='button'>Find more</Link>
          </p>
        </div>
      </div>
    );
  }

  render() {
    let placeholder = {
      url: 'https://res.cloudinary.com/homehapp/image/upload/v1439564093/london-view.jpg',
      alt: ''
    };

    let homes = [].concat(this.state.homes) || [];
    let neighborhoods = [].concat(this.state.neighborhoods) || [];
    debug('Neighborhoods', neighborhoods, 'Homes', homes);

    let partnerImage = {
      src: 'https://res.cloudinary.com/homehapp/image/upload/v1442998167/site/images/content/tablelamp.jpg',
      alt: '',
      width: 424,
      height: 515
    };

    let leftImage = {
      src: 'https://res.cloudinary.com/homehapp/image/upload/v1446213568/site/images/content/homehapp_web_phone_left.png',
      alt: '',
      width: 300,
      height: 856
    };
    let rightImage = {
      src: 'https://res.cloudinary.com/homehapp/image/upload/v1446213569/site/images/content/homehapp_web_phone_right.png',
      alt: '',
      width: 300,
      height: 856
    };

    return (
      <div id='mainpage' className='mainpage'>
        <BigImage gradient='green' fixed image={placeholder} proportion={0.8}>
          <LargeText align='center' valign='middle' proportion={0.8}>
            <div className='splash'>
              <h1>Find the home<br />you belong to</h1>
            </div>
          </LargeText>
        </BigImage>
        {this.renderHomeList(homes)}
        <ContentBlock className='with-gradient'>
          <Columns cols={2} className='table' valign='middle'>
            <div className='left' data-valign='middle'>
              <Image {...leftImage} />
            </div>
            <div data-valign='middle'>
              Lorem ipsum dolor sit amet.
            </div>
          </Columns>
          <Columns cols={2} className='table'>
            <div>
              Lorem ipsum dolor sit amet.
            </div>
            <div className='right' data-valign='middle'>
              <Image {...rightImage} />
            </div>
          </Columns>
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
        {this.renderNeighborhoods(neighborhoods)}
      </div>
    );
  }
}
