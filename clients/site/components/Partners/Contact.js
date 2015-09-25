'use strict';

import React from 'react';

import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import PartnersForm from './Form';

export default class PartnersContact extends React.Component {
  render() {
    return (
      <ContentBlock className='padded' align='left' valign='top'>
        <PartnersForm />
      </ContentBlock>
    );
  }
}
