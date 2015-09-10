'use strict';

import React from 'react';
import { Link } from 'react-router';

import Columns from '../../../common/components/Widgets/Columns';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Icon from '../../../common/components/Widgets/Icon';

export default class FormsPartners extends React.Component {
  render() {
    return (
      <ContentBlock className='padded' align='left' valign='top'>
        <div className='center'>
          <Icon type='clipboard' />
        </div>
        <h1>Partners</h1>
        <p>Partners contact form will be here</p>
      </ContentBlock>
    );
  }
}
