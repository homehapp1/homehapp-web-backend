'use strict';

import React from 'react';

class LargeText extends React.Component {
  static propTypes = {
    align: React.PropTypes.string,
    valign: React.PropTypes.string,
    children: React.PropTypes.oneOf([
      React.PropTypes.object,
      React.PropTypes.array
    ]),
    proportion: React.PropTypes.number,
    className: React.PropTypes.string
  };

  static defaultProps = {
    align: 'left',
    valign: 'top',
    proportion: 1,
    className: null
  };

  render() {
    let classes = [
      'widget',
      'large-text',
      'full-height'
    ];

    if (this.props.className) {
      classes.push(this.props.className);
    }

    let props = {
      'data-align': this.props.align,
      'data-valign': this.props.valign
    };

    return (
      <div className='widget large-text'>
        <div className='width-wrapper full-height' data-proportion={this.props.proportion}>
          <div className='content' {...props}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default LargeText;
