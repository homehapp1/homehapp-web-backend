'use strict';

import React from 'react';
import DOMManipulator from '../../DOMManipulator';

export default class Columns extends React.Component {
  static propTypes = {
    max: React.PropTypes.number,
    cols: React.PropTypes.number.isRequired,
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

  componentDidMount() {
    let node = new DOMManipulator(this.refs.container);
    let rows = node.getByClass('row');

    for (let i = 0; i < rows.length; i++) {
      let columns = rows[i].children();
      for (let n = 0; n < columns.length; n++) {
        let children = columns[n].children();
        this.copyClass(children, columns[n]);
      }
    }
  }

  copyClass(children, column) {
    if (!children.length) {
      return null;
    }
    let cls = String(children[0].node.className).match(/(span[0-9+])/);
    if (cls) {
      column.addClass(cls[1]);
    }
  }

  renderChildren() {
    let cols = Math.max(1, Math.round(this.props.cols));
    let last = Math.max(1, Math.min(this.props.children.length, this.props.max));
    let rows = [];
    let row = [];

    // Create individual cells of each child found in the column wrapper
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

      // Store the child element, i.e. cell in the current row for later use
      row.push((
        <div className={classes.join(' ')} key={index}>
          {child}
        </div>
      ));

      // When the row is full, store it for later use and initialize a new one
      if (index % cols === cols - 1 || index === last - 1) {
        rows.push(row);
        row = [];
      }

      return null;
    });

    return (
      <div className='columns-container'>
        {
          // Wrap cells into rows
          rows.map((r, i) => {
            return (
              <div className='row' key={i}>
                {
                  r.map((item) => {
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
      <div className={classes.join(' ')} data-align={this.props.align} data-valign={this.props.valign} ref='container'>
        {this.renderChildren()}
      </div>
    );
  }
}
