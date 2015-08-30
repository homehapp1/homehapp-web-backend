'use strict';

import React from 'react';

class ContentBlock extends React.Component {
  static propTypes = {
    src: React.PropTypes.string,
    alt: React.PropTypes.string,
    fixed: React.PropTypes.bool,
    gradient: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]),
    className: React.PropTypes.string,
    fullheight: React.PropTypes.bool
  };

  render() {
    let classes = [
      'widget',
      'content-block'
    ];

    if (this.props.className) {
      classes.push(this.props.className);
    }

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
