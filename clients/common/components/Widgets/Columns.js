'use strict';

import React from 'react';

class Columns extends React.Component {
  static propTypes = {
    max: React.PropTypes.number,
    columns: React.PropTypes.number.isRequired,
    children: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]),
    align: React.PropTypes.string,
    valign: React.PropTypes.string,
    className: React.PropTypes.string
  }

  static defaultProps = {
    max: 1000,
    align: 'left',
    valign: 'top',
    className: null
  }

  renderChildren() {
    let cols = Math.max(1, Math.round(this.props.columns));
    let last = Math.max(1, Math.min(this.props.children.length, this.props.max));
    let rows = [];
    let row = [];

    React.Children.map(this.props.children, function(child, index) {
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

      row.push((
        <div className={classes.join(' ')} key={index}>
          {child}
        </div>
      ));

      if (index % cols === cols - 1 || index === last - 1) {
        rows.push(row);
        row = [];
      }

      return null;
    });

    return (
      <div className='columns-container'>
        {
          rows.map((r, i) => {
            return (
              <div className='row' key={i}>
                {
                  r.map((item, index) => {
                    return item;
                  })
                }
              </div>
            );
          })
        }
      </div>
    );
  }

  render() {
    let classes = ['columns', 'widget', 'clearfix'];

    if (this.props.className) {
      classes.push(this.props.className);
    }

    return (
      <div className={classes.join(' ')} data-align={this.props.align} data-valign={this.props.valign}>
        {this.renderChildren()}
      </div>
    );
  }
}

export default Columns;
