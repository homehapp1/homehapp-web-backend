import React from 'react';
import { Link } from 'react-router';
// import Tabs from 'react-simpletabs';

import HomeListStore from '../../stores/HomeListStore';
import HomeList from '../Home/HomeList';

import NeighborhoodListStore from '../../stores/NeighborhoodListStore';

import BigImage from '../../../common/components/Widgets/BigImage';
import Hoverable from '../../../common/components/Widgets/Hoverable';
import LargeText from '../../../common/components/Widgets/LargeText';
import Loading from '../../../common/components/Widgets/Loading';
import { setPageTitle } from '../../../common/Helpers';

// let debug = require('../../../common/debugger')('Homepage');

export default class Homepage extends React.Component {
  constructor() {
    super();
    this.homeStoreListener = this.onHomeListChange.bind(this);
    this.neighborhoodStoreListener = this.onNeighborhoodListChange.bind(this);
  }

  state = {
    error: null,
    homes: HomeListStore.getState().items
    // neighborhoods: NeighborhoodListStore.getState().items
  }

  componentDidMount() {
    // Trigger the resize events defined in layout
    window.dispatchEvent(new Event('resize'));
    document.getElementsByTagName('body')[0].setAttribute('data-handler', 'homepage');

    HomeListStore.listen(this.homeStoreListener);
    // NeighborhoodListStore.listen(this.neighborhoodStoreListener);
    HomeListStore.fetchItems();
    // NeighborhoodListStore.fetchItems();

    setPageTitle('Discover y');
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].removeAttribute('data-handler');
    HomeListStore.unlisten(this.homeStoreListener);
    // NeighborhoodListStore.unlisten(this.neighborhoodStoreListener);
    setPageTitle();
  }

  onHomeListChange(state) {
    this.setState({
      status: state.error,
      homes: state.items
    });
  }

  onNeighborhoodListChange(state) {
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
      <div className='mainpage-list clearfix widget pattern padded'>
        <HomeList items={homes} />
      </div>
    );
  }

  renderNeighborhoods(neighborhoods) {
    if (!neighborhoods || !neighborhoods.length) {
      return null;
    }
    neighborhoods.sort((a, b) => {
      if (a.story.blocks.length > b.story.blocks.length) {
        return -1;
      }
      if (a.story.blocks.length < b.story.blocks.length) {
        return 1;
      }
      if (a.title > b.title) {
        return -1;
      }
      if (a.title < b.title) {
        return 1;
      }
      return 0;
    });

    let counter = 0;
    return (
      <div className='mainpage-list clearfix with-gradient widget'>
        <div className='neighborhood-list preview-list short-list' ref='neighborhoodList'>
          <h2 className='block-title'>Where is your home</h2>
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
                let city = 'london';

                if (neighborhood.location.city && neighborhood.location.city.slug) {
                  city = neighborhood.location.city.slug;
                }

                return (
                  <div className='preview' key={index}>
                    <Hoverable {...neighborhood.mainImage} width={464} height={556} mode='fill' applySize className='with-shadow'>
                      <h3 className='title'>
                        <Link to='neighborhoodView' params={{city: city, neighborhood: neighborhood.slug}} className='wrapper link'>
                          <span>{neighborhood.title}</span>
                        </Link>
                      </h3>

                      <div className='actions'>
                        <Link to='neighborhoodView' params={{city: city, neighborhood: neighborhood.slug}}>
                          Read About
                        </Link>
                        <Link to='neighborhoodViewHomes' params={{city: city, neighborhood: neighborhood.slug}}>
                          Show Homes
                        </Link>
                      </div>
                    </Hoverable>
                  </div>
                );
              })
            }
          </div>
        </div>
        <hr className='spacer clearfix' />
        <p className='call-to-action'>
          <Link to='neighborhoodList' params={{city: 'london'}} className='button'>Find more</Link>
        </p>
      </div>
    );
  }

  render() {
    // let placeholder = {
    //   url: 'https://res.cloudinary.com/homehapp/image/upload/v1439564093/london-view.jpg',
    //   alt: ''
    // };

    let mainImage = {
      url: 'https://res.cloudinary.com/homehapp/image/upload/v1446508515/site/images/content/london-view-2.jpg',
      alt: 'Red brick London',
      align: 'center',
      valign: 'middle',
      gravity: 'center'
    };
    // let mainImageAspectRatio = 4828 / 3084;

    let homes = [].concat(this.state.homes) || [];
    // let neighborhoods = [].concat(this.state.neighborhoods) || [];

    // Match the original proportions for the phone images
    let w = 180;
    let h = Math.round(856 / 300 * w);

    // let leftImage = {
    //   src: 'https://res.cloudinary.com/homehapp/image/upload/v1446213568/site/images/content/homehapp_web_phone_left.png',
    //   alt: '',
    //   width: w,
    //   height: h,
    //   className: 'hovering'
    // };
    // let rightImage = {
    //   src: 'https://res.cloudinary.com/homehapp/image/upload/v1446213569/site/images/content/homehapp_web_phone_right.png',
    //   alt: '',
    //   width: w,
    //   height: h,
    //   className: 'hovering'
    // };

    return (
      <div id='mainpage' className='mainpage'>
        <BigImage className='masked full-height' image={mainImage} proportion={0.9} align='center' valign='middle'>
          <LargeText align='center' valign='middle' proportion={0.9} className='full-height'>
            <div className='splash'>
              <h1>Find the home<br />you belong to</h1>
            </div>
          </LargeText>
        </BigImage>
        {this.renderHomeList(homes)}
      </div>
    );
  }
}
