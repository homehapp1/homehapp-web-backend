
import React from 'react';
import Image from './Image';

export default class Icon extends React.Component {
  static propTypes = {
    type: React.PropTypes.string.isRequired,
    color: React.PropTypes.string,
    size: React.PropTypes.string,
    className: React.PropTypes.string
  };

  static defaultProps = {
    color: 'black',
    size: 'medium',
    className: ''
  };

  render() {
    let image = {
      src: `images/icons/white/${this.props.type}.svg`,
      alt: '',
      type: 'asset'
    };

    let classes = ['widget', 'icon', this.props.color, this.props.size, this.props.type];

    if (this.props.className) {
      classes.push(this.props.className);
    }

    return (
      <span className={classes.join(' ')}><Image {...image} /></span>
    );
  }
}
