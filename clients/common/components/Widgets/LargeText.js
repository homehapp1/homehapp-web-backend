'use strict';

import React from 'react';

class LargeText extends React.Component {
  static propTypes = {
    align: React.PropTypes.string,
    vertical: React.PropTypes.string,
    children: React.PropTypes.array.isRequired
  };

  render() {
    let classes = [
      'item',
      'large-text',
      'full-height'
    ];

    let align = this.props.align || 'left';
    let valign = this.props.vertical || 'top';

    return (
      <div className={classes.join(' ')} data-align={align} data-vertical={valign}>
        <div className='width-wrapper'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default LargeText;
