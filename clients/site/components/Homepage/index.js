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
          <h2 className='block-title'>Exclusively for homehapp</h2>
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
    let neighborhoods = [].concat(this.state.neighborhoods) || [];
    debug('Neighborhoods', neighborhoods, 'Homes', homes);

    // Match the original proportions for the phone images
    let w = 180;
    let h = Math.round(856 / 300 * w);

    let leftImage = {
      src: 'https://res.cloudinary.com/homehapp/image/upload/v1446213568/site/images/content/homehapp_web_phone_left.png',
      alt: '',
      width: w,
      height: h,
      className: 'hovering'
    };
    let rightImage = {
      src: 'https://res.cloudinary.com/homehapp/image/upload/v1446213569/site/images/content/homehapp_web_phone_right.png',
      alt: '',
      width: w,
      height: h,
      className: 'hovering'
    };

    // <BigImage className='masked' image={mainImage} aspectRatio={mainImageAspectRatio} align='center' valign='middle'>
    //   <LargeText align='center' valign='middle' aspectRatio={mainImageAspectRatio}>
    //     <div className='splash'>
    //       <h1>Find the home<br />you belong to</h1>
    //     </div>
    //   </LargeText>
    // </BigImage>

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
        <ContentBlock className='with-gradient'>
          <h2 className='block-title'>Why homehapp?</h2>
          <div className='narrow-text emphasize'>
            <p>
              ”We believe there’s a better way to help people find the homes
              they belong to. It’s an idea whose time has come, and we at
              homehapp are making it happen.”
            </p>
            <p>
              Home is more than a place. It’s a feeling – a sense of belonging.
              A home isn’t just the four walls we live in – it’s
              our street, our neighborhood and our town.
            </p>
          </div>
        </ContentBlock>
        <ContentBlock className='with-gradient'>
          <hr className='spacer' />
          <Columns cols={2} className='table emphasize' valign='middle'>
            <div className='centered' data-valign='middle'>
              <Image {...leftImage} />
            </div>
            <div data-valign='middle'>
              <h3>Capture your moments</h3>
              <p>
                You can upload your home photos and videos, and write about your
                home life in a few clicks from your phone. Add insights or news
                on your neighbourhood and share with friends.
                Keep a history of your house, record repairs and
                renovations. Organise information, floor plans, EPC – all in
                one place.
              </p>
              <p>
                On homehapp, every home can have a digital identity
              – which can be kept private or published to the open community.
              </p>
            </div>
          </Columns>
          <hr className='spacer' />
          <Columns cols={2} className='table rearrange emphasize' valign='middle'>
            <div data-valign='middle'>
              <h3>We serve you when letting or renting</h3>
              <p>
                When you wish to let or sell your home, you can do so
                exactly in the ways that suit you.
              </p>
              <p>
                You may wish to deal directly, and publish your offer to the
                entire homehapp community.
              </p>
              <p>
                You can engage pro services – Photographer,
                Surveyor, Legal et al
              </p>
              <p>
                You can appoint an Estate Agent of your choice
                to provide transaction management services
              </p>
            </div>
            <div className='centered' data-valign='middle'>
              <Image {...rightImage} />
            </div>
          </Columns>
          <hr className='spacer' />
        </ContentBlock>
        <ContentBlock className='with-gradient'>
          <hr className='spacer' />
          <h2 className='block-title'>Partner with us</h2>
          <div className='center emphasize narrow-text'>
            <p>
              homehapp is a platform for buyers and sellers, landlords and
              tenants, Estate agents, legal conveyancers, chartered surveyors.
              Expand your reach and increase your sales.
            </p>
            <hr className='spacer' />
            <p className='call-to-action'>
              <Link to='partners' className='button white'>Contact</Link>
            </p>
          </div>
        </ContentBlock>
        <ContentBlock className='with-gradient'>
          <hr className='spacer' />
          <h2>Our Mission</h2>
          <div className='center emphasize narrow-text'>
            <p>
              homehapp aims to serve an entire community of browsers and
              storytellers who wish to create and consume home and
              neighbourhood moments, which go beyond sales and lettings.
              It’s a platform to provide an online identity and life to
              <Link to='homes'>homes</Link> and
              <Link to='neighborhoodList' params={{city: 'london'}}>neighborhoods.</Link>
            </p>
            <hr className='spacer' />
          </div>
        </ContentBlock>
        {this.renderNeighborhoods(neighborhoods)}
      </div>
    );
  }
}
