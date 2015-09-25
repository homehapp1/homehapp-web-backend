'use strict';

import React from 'react';
// import { Link } from 'react-router';

import BigVideo from '../../../common/components/Widgets/BigVideo';
import Columns from '../../../common/components/Widgets/Columns';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Icon from '../../../common/components/Widgets/Icon';
import Video from '../../../common/components/Widgets/Video';

import { setPageTitle } from '../../../common/Helpers';


export default class ContentAbout extends React.Component {
  componentDidMount() {
    setPageTitle('About us');
  }

  componentWillUnmount() {
    setPageTitle();
  }

  render() {
    return (
      <div id='aboutUs'>
        <ContentBlock className='padded about' align='left' valign='top'>
          <div className='centered homehapp'>
            <Icon type='homehapp' color='turquoise' className='large' />
          </div>
          <h1>Homes that make people happy</h1>
          <p>
            Homehapp stands for dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
          </p>
          <hr className='spacer' />
          <Video src='https://res.cloudinary.com/homehapp/video/upload/v1439796972/contentMockup/IMG_0914.mov' mode='html5' aspectRatio='16:9' />
          <hr className='spacer' />
          <Columns cols={2} className='padded'>
            <ContentBlock>
              <div className='center'>
                <Icon type='clipboard' className='large' />
              </div>
              <h2>Partner with us</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
              </p>
              <p className='right'>
                <a href="#">Read more ›</a>
              </p>
            </ContentBlock>
            <ContentBlock>
              <div className='center'>
                <Icon type='clipboard' className='large' />
              </div>
              <h2>How it works?</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
              </p>
            </ContentBlock>
          </Columns>
        </ContentBlock>
      </div>
    );
  }
}
