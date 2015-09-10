'use strict';

import React from 'react';
import { Link } from 'react-router';

import ContentBlock from '../../../common/components/Widgets/ContentBlock';

export default class Content extends React.Component {
  render() {
    console.log('Content', this);
    return (
      <ContentBlock className='padded'>
        Content lorem ipsum for {this.props.params.slug}
      </ContentBlock>
    );
  }
}
