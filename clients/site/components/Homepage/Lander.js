import React from 'react';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';

export default class Lander extends React.Component {
  render() {
    return (
      <div id='landing'>
        <ContentBlock>
          <img src='http://www.quartetrep.org/underconstruction.png' alt='Under construction' />
          <p>
            The website is currently under a construction site. We hope to release the poltergeists promptly.
          </p>
        </ContentBlock>
      </div>
    );
  }
}
