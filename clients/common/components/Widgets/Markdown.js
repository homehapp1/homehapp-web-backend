import React from 'react';
let marked = require('marked');
let debug = require('../../../common/debugger')('Markdown');

export default class Markdown extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array,
      React.PropTypes.null
    ]),
    className: React.PropTypes.string,
    align: React.PropTypes.string
  }

  static defaultProps = {
    className: null,
    align: null
  }

  renderChildren() {
    let children = [];
    let classes = ['html-content'];
    if (this.props.className) {
      classes.push(this.props.className);
    }

    children = React.Children.map(this.props.children, (item, index) => {
      debug('item', item);
      let rendered = null;

      switch (typeof item) {
        case 'object':
          try {
            rendered = React.renderToString(item);
          } catch (error) {
            debug('Failed to convert React object to string', error);
          }
          break;
        case 'string':
        case 'number':
          rendered = item;
      }
      debug('got rendered', rendered);

      if (!rendered) {
        return null;
      }
      let markdown = marked(rendered);
      debug('Return HTML', markdown);
      return (
        <div className={classes.join(' ')} dangerouslySetInnerHTML={{__html: markdown}} key={`markdown-${index}`}></div>
      );
    });
    return children;
  }

  render() {
    let classes = ['markdown', 'widget'];
    if (this.props.align) {
      classes.push(this.props.align);
    }
    return (
      <div className={classes.join(' ')}>
        {this.renderChildren()}
      </div>
    );
  }
}
