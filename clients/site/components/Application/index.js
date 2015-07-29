"use strict";

import React from "react";
let {RouteHandler} = require("react-router");

import ApplicationStore from "../../../common/stores/ApplicationStore";

import Header from "../Header";
import Footer from "../Footer";

class Application extends React.Component {
  static defaultProps = {
  }
  static propTypes = {
    // autoPlay: React.PropTypes.bool.isRequired,
    // maxLoops: React.PropTypes.number.isRequired,
    // posterFrameSrc: React.PropTypes.string.isRequired,
  }
  state = {
    // loopsRemaining: this.props.maxLoops,
  }

  constructor(props) {
    super(props);
    // Operations usually carried out in componentWillMount go here
  }

  render() {
    return (
      <div className="application">
        <Header {...this.props} />
        <RouteHandler />
        <Footer {...this.props} />
      </div>
    );
  }
}

export default Application;
