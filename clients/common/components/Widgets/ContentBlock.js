'use strict';

import React from 'react';
import ApplicationStore from '../../stores/ApplicationStore';

class ContentBlock extends React.Component {
  static propTypes = {
    src: React.PropTypes.string,
    alt: React.PropTypes.string,
    fixed: React.PropTypes.boolean,
    gradient: React.PropTypes.string
  };

  constructor() {
    super();
    this.config = ApplicationStore.getState().config;
  }

  render() {
    let classes = [
      'item',
      'content-block'
    ];

    if (this.props.fullheight) {
      classes.push('full-height');
    }

    return (
      <div className={classes.join(' ')}>
        <div className='width-wrapper'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default ContentBlock;
