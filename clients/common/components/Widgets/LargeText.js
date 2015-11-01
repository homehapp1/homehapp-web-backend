import React from 'react';

export default class LargeText extends React.Component {
  static propTypes = {
    align: React.PropTypes.string,
    valign: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.null,
      React.PropTypes.object,
      React.PropTypes.array
    ]),
    proportion: React.PropTypes.number,
    className: React.PropTypes.string,
    aspectRatio: React.PropTypes.number
  };

  static defaultProps = {
    align: 'center',
    valign: 'middle',
    proportion: null,
    aspectRatio: null,
    className: null
  };

  render() {
    let classes = [
      'width-wrapper'
    ];

    if (this.props.className) {
      classes.push(this.props.className);
    }

    let props = {
      'data-align': this.props.align,
      'data-valign': this.props.valign
    };

    if (this.props.aspectRatio) {
      classes.push('aspect-ratio');
      props['data-aspect-ratio'] = this.props.aspectRatio;
    } else {
      classes.push('full-height');
    }

    return (
      <div className='widget large-text'>
        <div className={classes.join(' ')} {...props}>
          <div className='content' {...props}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
