'use strict';

import React from 'react';
import { Link } from 'react-router';

import Columns from '../../../common/components/Widgets/Columns';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Icon from '../../../common/components/Widgets/Icon';

export default class ContentPartners extends React.Component {
  render() {
    return (
      <ContentBlock className='padded' align='left' valign='top'>
        <div className='center'>
          <Icon type='clipboard' className='large' />
        </div>
        <h1>Partners</h1>
        <p>Content comes here</p>
      </ContentBlock>
    );
  }
}
