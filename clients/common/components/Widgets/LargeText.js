'use strict';

import React from 'react';

class LargeText extends React.Component {
  static propTypes = {
    align: React.PropTypes.string,
    valign: React.PropTypes.string,
    children: React.PropTypes.object.isRequired
  };

  render() {
    let classes = [
      'widget',
      'large-text',
      'full-height'
    ];

    let align = this.props.align || 'left';
    let valign = this.props.valign || 'top';

    return (
      <div className={classes.join(' ')} data-align={align} data-valign={valign}>
        <div className='width-wrapper'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default LargeText;
