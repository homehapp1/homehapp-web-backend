'use strict';

import React from 'react';
// import { Link } from 'react-router';

import Columns from '../../../common/components/Widgets/Columns';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Icon from '../../../common/components/Widgets/Icon';

export default class ContentAbout extends React.Component {
  render() {
    return (
      <ContentBlock className='padded about' align='left' valign='top'>
        <div className='centered homehapp'>
          <Icon type='homehapp' color='turquoise' className='large' />
        </div>
        <h1>Homes that make people happy</h1>
        <p>
          Homehapp stands for dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
        </p>
        <hr className='spacer' />
        <iframe src='https://player.vimeo.com/video/74145280' width='100%' height='650' frameBorder='0' webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe>
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
    );
  }
}
