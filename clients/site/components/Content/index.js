import React from 'react';
// import { Link } from 'react-router';

import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import { setPageTitle } from '../../../common/Helpers';

export default class Content extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  };

  componentDidMount() {
    setPageTitle(this.props.params.slug.substr(0, 1).toUpperCase() + this.props.params.slug.substr(1));
  }

  componentWillUnmount() {
    setPageTitle();
  }

  render() {
    return (
      <ContentBlock className='padded'>
        Content lorem ipsum for {this.props.params.slug}
      </ContentBlock>
    );
  }
}
