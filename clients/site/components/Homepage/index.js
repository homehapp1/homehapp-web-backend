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
          <h2 className='block-title'>Exclusively for Homehapp</h2>
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

    // Match the original proportions for the phone images
    let w = 200;
    let h = Math.round(856 / 300 * w);

    let leftImage = {
      src: 'https://res.cloudinary.com/homehapp/image/upload/v1446213568/site/images/content/homehapp_web_phone_left.png',
      alt: '',
      width: w,
      height: h
    };
    let rightImage = {
      src: 'https://res.cloudinary.com/homehapp/image/upload/v1446213569/site/images/content/homehapp_web_phone_right.png',
      alt: '',
      width: w,
      height: h
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
          <h2 className='block-title'>Why Homehapp?</h2>
          <p>
            We believe there is a better way to help people find homes they
            belong to. It is an idea whose time has come, and we at Homehapp
            are making it happen.
          </p>
          <Columns cols={2} className='table' valign='middle'>
            <div className='centered' data-valign='middle'>
              <Image {...leftImage} />
            </div>
            <div data-valign='middle'>
              We want to bring transparency and efficiency to the property
              market, putting people in touch with the right professionals so
              that they get the best service. Our aim is to help everybody
              find a home that’s right for them and a home that they love –
              the home that will make them happy.
            </div>
          </Columns>
          <Columns cols={2} className='table' valign='middle'>
            <div data-valign='middle'>
              HomeHapp brings out the true essence of homes and neighborhoods
              by showing them through the eyes of the people who live there.
              It offers an easy to use platform on which to post, and share
              home moments and home stories. This content connects buyers and
              tenants to sellers and landlords, as well as linking them to a
              host of service providers in a sharing-economy model.
            </div>
            <div className='centered' data-valign='middle'>
              <Image {...rightImage} />
            </div>
          </Columns>
          <h2 className='block-title'>Partner with us</h2>
          <Columns cols={4} className='table important' align='center' valign='middle'>
            <div className='span1'></div>
            <div className='span5 centered'>
              <p>
                <em>
                  Homehapp is a platform for buyers and sellers, landlords and
                  tenants, Estate agents, legal conveyancers, chartered surveyors.
                  Expand your reach and increase your sales.
                </em>
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
