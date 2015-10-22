import React from 'react';

export default class ContentBlock extends React.Component {
  static propTypes = {
    align: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]),
    className: React.PropTypes.string,
    fullheight: React.PropTypes.bool
  };

  static defaultProps = {
    align: 'left'
  };

  render() {
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

    return (
      <div className={classes.join(' ')}>
        <div className='width-wrapper'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
