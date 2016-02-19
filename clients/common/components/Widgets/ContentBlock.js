import React from 'react';
import BaseWidget from './BaseWidget';

export default class ContentBlock extends BaseWidget {
  static propTypes = {
    align: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]),
    className: React.PropTypes.string,
    fullheight: React.PropTypes.bool,
    id: React.PropTypes.string
  };

  static defaultProps = {
    align: 'left'
  };

  validate(props) {
    if (['left', 'center', 'right'].indexOf(props.align) === -1) {
      throw new Error('Allowed values for "align" are "left", "center" and "right"');
    }
  }

  renderWidget() {
    let classes = [
      'widget',
      'content-block',
      this.props.align
    ];

    if (this.props.className) {
      classes.push(this.props.className);
    }

    if (this.props.fullheight) {
      classes.push('full-height');
    }

    let props = {
      className: classes.join(' ')
    };

    if (this.props.id) {
      props.id = this.props.id;
    }

    return (
      <div {...props}>
        <div className='width-wrapper'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
