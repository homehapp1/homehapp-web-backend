'use strict';

import React from 'react';

class ContentBlock extends React.Component {
  static propTypes = {
    src: React.PropTypes.string,
    alt: React.PropTypes.string,
    fixed: React.PropTypes.bool,
    gradient: React.PropTypes.string
  };

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
