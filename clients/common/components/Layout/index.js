"use strict";

import React from "react";
import { Link } from "react-router";

class Layout extends React.Component {
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
