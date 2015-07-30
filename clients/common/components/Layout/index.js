"use strict";

import React from "react";

class Layout extends React.Component {
  static propTypes = {
    children: React.PropTypes.object.isRequired,
    width: React.PropTypes.number.isRequired
  }
  static defaultProps = {
    width: 500
  }

  render() {
    let style = {
      width: `${this.props.width}px`
    };
    return (
      <div id="layout" style={style}>
        {this.props.children}
      </div>
    );
  }
}

export default Layout;
