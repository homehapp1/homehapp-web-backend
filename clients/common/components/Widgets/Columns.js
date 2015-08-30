'use strict';

import React from 'react';

class Columns extends React.Component {
  static propTypes = {
    max: React.PropTypes.number,
    columns: React.PropTypes.number.isRequired,
    children: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ])
  }

  static defaultProps = {
    max: 1000
  }

  renderChildren() {
    let cols = Math.max(1, Math.round(this.props.columns));
    let last = Math.max(1, Math.min(this.props.children.length, this.props.max));

    return React.Children.map(this.props.children, function(child, index) {
      if (index >= last) {
        return null;
      }

      let classes = [];
      classes.push(`cols-${cols}`);

      if (index % cols === 0) {
        classes.push('row-start');
      } else if (index % cols === cols - 1) {
        classes.push('row-end');
      }

      if (!index) {
        classes.push('first');
      }

      return (
        <div className={classes.join(' ')} key={index}>
          {child}
        </div>
      );
    });
  }

  render() {
    return (
      <div className='columns widget'>
        <div className='width-wrapper clearfix'>
          <div className='columns-container'>
            {this.renderChildren()}
          </div>
        </div>
      </div>
    );
  }
}

export default Columns;
