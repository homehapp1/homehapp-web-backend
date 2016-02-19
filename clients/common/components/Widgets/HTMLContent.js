import React from 'react';
import ContentBlock from '../Widgets/ContentBlock';

export default class HTMLContent extends React.Component {
  static propTypes = {
    content: React.PropTypes.string.isRequired,
    className: React.PropTypes.string
  };

  static defaultProps = {
    className: null
  };

  render() {
    let classes = [
      'widget',
      'content-block'
    ];

    if (this.props.className) {
      classes.push(this.props.className);
    }

    return (
      <ContentBlock>
        <div className='widget html-content' dangerouslySetInnerHTML={{__html: this.props.content}}></div>
      </ContentBlock>
    );
  }
}
