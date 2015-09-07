'use strict';

import React from 'react';

import ContentBlock from './ContentBlock';

class Loading extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOf([
      React.PropTypes.object,
      React.PropTypes.array
    ])
  };

  render() {
    return (
      <ContentBlock className='widget loading padded centered'>
        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAxNiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjE2IiBmaWxsPSJibGFjayI+PGNpcmNsZSB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4IDApIiBjeD0iMCIgY3k9IjgiIHI9IjAiPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDsgNDsgMDsgMCIgZHVyPSIxLjJzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjAiIGtleXRpbWVzPSIwOzAuMjswLjc7MSIga2V5U3BsaW5lcz0iMC4yIDAuMiAwLjQgMC44OzAuMiAwLjYgMC40IDAuODswLjIgMC42IDAuNCAwLjgiIGNhbGNNb2RlPSJzcGxpbmUiIC8+PC9jaXJjbGU+PGNpcmNsZSB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNiAwKSIgY3g9IjAiIGN5PSI4IiByPSIwIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiB2YWx1ZXM9IjA7IDQ7IDA7IDAiIGR1cj0iMS4ycyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjMiIGtleXRpbWVzPSIwOzAuMjswLjc7MSIga2V5U3BsaW5lcz0iMC4yIDAuMiAwLjQgMC44OzAuMiAwLjYgMC40IDAuODswLjIgMC42IDAuNCAwLjgiIGNhbGNNb2RlPSJzcGxpbmUiIC8+PC9jaXJjbGU+PGNpcmNsZSB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNCAwKSIgY3g9IjAiIGN5PSI4IiByPSIwIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiB2YWx1ZXM9IjA7IDQ7IDA7IDAiIGR1cj0iMS4ycyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjYiIGtleXRpbWVzPSIwOzAuMjswLjc7MSIga2V5U3BsaW5lcz0iMC4yIDAuMiAwLjQgMC44OzAuMiAwLjYgMC40IDAuODswLjIgMC42IDAuNCAwLjgiIGNhbGNNb2RlPSJzcGxpbmUiIC8+PC9jaXJjbGU+PC9zdmc+" alt="..." />
        {this.props.children}
      </ContentBlock>
    );
  }
}

export default Loading;
