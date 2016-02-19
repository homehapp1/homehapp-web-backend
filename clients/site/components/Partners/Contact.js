import React from 'react';

import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import PartnersForm from './Form';
import { setPageTitle } from '../../../common/Helpers';

export default class PartnersContact extends React.Component {
  componentDidMount() {
    setPageTitle('Contact us | Become our partner');
  }

  componentWillUnmount() {
    setPageTitle();
  }

  render() {
    return (
      <ContentBlock className='padded' align='left' valign='top'>
        <PartnersForm />
      </ContentBlock>
    );
  }
}
