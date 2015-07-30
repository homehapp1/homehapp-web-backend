"use strict";

import React from "react";
import { Link } from "react-router";

class Homepage extends React.Component {
  render() {
    return (
      <div>
        <div className="mainTitle">
          <h1>Welcome to home!</h1>
        </div>
        <div className="featuredHomes">
          <p>
            <Link to="home" params={{slug: "123"}}>Home 123</Link>
          </p>
          <p>
            <Link to="home" params={{slug: "234"}}>Home 234</Link>
          </p>
        </div>
      </div>
    );
  }
}

export default Homepage;
