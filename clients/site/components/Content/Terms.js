import React from 'react';
// import { Link } from 'react-router';

// import Columns from '../../../common/components/Widgets/Columns';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
// import Icon from '../../../common/components/Widgets/Icon';
import { setPageTitle } from '../../../common/Helpers';

export default class ContentTerms extends React.Component {
  componentDidMount() {
    setPageTitle('Terms & conditions');
  }

  componentWillUnmount() {
    setPageTitle();
  }

  render() {
    return (
      <ContentBlock className='padded' align='left' valign='top'>
        <h1>Terms & conditions</h1>
        <p>Content comes here</p>
      </ContentBlock>
    );
  }
}
