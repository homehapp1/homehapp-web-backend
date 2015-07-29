"use strict";

import React from "react";
import { Link } from "react-router";

class HomeStory extends React.Component {
  render() {
    return (
      <div className="story">
        <h1>Home Story for {this.props.params.slug}</h1>
        <Link to="homeDetails" params={{slug: this.props.params.slug}}>Got to details</Link>
        <p>
          <Link to="app">Back to frontpage</Link>
        </p>
      </div>
    );
  }
}

export default HomeStory;
